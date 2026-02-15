import type { CSSProperties } from 'react';

import { designTokenManifest } from '@styles/themes/tokens.generated';
import externalTokens from '@tokens/Externals/Default.json';
import engageTokens from '@tokens/Internals/Engage.json';
import legacyTokens from '@tokens/Internals/Legacy.json';
import { TOKEN_A11Y_RULES, type TokenA11yRule } from './token-a11y-rules';

const REFERENCE_PATTERN = /^\{(.+)\}$/;

type TokenDictionary = Record<string, unknown>;

export type ThemeSlug = typeof designTokenManifest.themes[number]['slug'];
export type ResolveStatus = 'ok' | 'missing-ref' | 'cycle' | 'invalid';
export type SnapshotDiffStatus = 'added' | 'removed' | 'changed' | 'unchanged';

export interface ResolveMeta {
  status: ResolveStatus;
  unresolvedPath?: string;
}

interface ResolveResult {
  value: unknown;
  meta: ResolveMeta;
}

interface TokenNode {
  $type?: string;
  $value?: unknown;
  $description?: string;
  [key: string]: unknown;
}

interface RawTokenRow {
  path: string[];
  basePath: string[];
  type?: string;
  reference: unknown;
  description?: string;
  invalidNode?: boolean;
}

interface CompositeProperty {
  name: string;
  reference: unknown;
  alias?: string;
}

export interface TokenRow extends RawTokenRow {
  alias?: string;
  cssVariable: string;
  values: Record<string, unknown>;
  resolvedValueByTheme: Record<string, unknown>;
  resolvedMetaByTheme: Record<string, ResolveMeta>;
  compositeValues?: Record<string, Record<string, unknown>>;
  compositeProperties?: CompositeProperty[];
  isComposite: boolean;
  displayPath?: string;
  diffStatus?: SnapshotDiffStatus;
}

interface SnapshotTokenEntry {
  type?: string;
  alias?: string;
  cssVariable: string;
  valuesByTheme: Record<string, unknown>;
}

export interface TokenSnapshot {
  version: number;
  generatedAt: string;
  themes: string[];
  tokens: Record<string, SnapshotTokenEntry>;
}

interface SnapshotDiffSummary {
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
}

export interface SnapshotDiffResult {
  rows: TokenRow[];
  summary: SnapshotDiffSummary;
}

export interface A11yResult {
  id: string;
  label: string;
  textTokenPath: string;
  backgroundTokenPath: string;
  minRatio: number;
  ratio: number | null;
  status: 'pass' | 'fail' | 'unknown';
  textColor: string | null;
  backgroundColor: string | null;
}

export interface TokenTypeGroup {
  groupId: string;
  groupLabel: string;
  rows: TokenRow[];
  count: number;
  warningCount: number;
  diffCounts: Record<SnapshotDiffStatus, number>;
}

const themeDataBySlug: Record<ThemeSlug, TokenDictionary> = {
  engage: engageTokens as TokenDictionary,
  legacy: legacyTokens as TokenDictionary,
};

const compositeTokenTypes = new Set(['typography', 'boxShadow']);
const TYPE_SORT_ORDER = [
  'color',
  'opacity',
  'spacing',
  'borderWidth',
  'borderRadius',
  'dimension',
  'number',
  'typography',
  'boxShadow',
] as const;

const TYPE_LABELS: Record<string, string> = {
  color: 'Color',
  opacity: 'Opacity',
  spacing: 'Spacing',
  borderWidth: 'Border Width',
  borderRadius: 'Border Radius',
  dimension: 'Dimension',
  number: 'Number',
  typography: 'Typography',
  boxShadow: 'Box Shadow',
  unknown: 'Unknown',
};

const themeSlugs = designTokenManifest.themes.map((theme) => theme.slug) as ThemeSlug[];

function isTokenNode(value: unknown): value is TokenNode {
  return Boolean(value && typeof value === 'object' && '$value' in (value as Record<string, unknown>));
}

function getNestedValue(root: TokenDictionary, segments: string[]): unknown {
  return segments.reduce<unknown>((acc, segment) => {
    if (!acc || typeof acc !== 'object') {
      return undefined;
    }

    return (acc as Record<string, unknown>)[segment];
  }, root);
}

function toCssVariable(path: string[]): string {
  if (!path.length) {
    return '';
  }

  const normalized = path
    .map((segment) =>
      segment
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
        .replace(/([0-9])([a-zA-Z])/g, '$1-$2')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase(),
    )
    .filter(Boolean);

  return `--${normalized.join('-')}`;
}

function severity(status: ResolveStatus): number {
  switch (status) {
    case 'invalid':
      return 3;
    case 'cycle':
      return 2;
    case 'missing-ref':
      return 1;
    default:
      return 0;
  }
}

function mergeMeta(results: ResolveMeta[]): ResolveMeta {
  return results.reduce<ResolveMeta>(
    (acc, current) => {
      if (severity(current.status) > severity(acc.status)) {
        return current;
      }

      return acc;
    },
    { status: 'ok' }
  );
}

export function resolveReferenceDetailed(
  value: unknown,
  theme: TokenDictionary,
  seen: string[] = []
): ResolveResult {
  if (typeof value !== 'string') {
    return { value, meta: { status: 'ok' } };
  }

  const match = value.match(REFERENCE_PATTERN);
  if (!match) {
    return { value, meta: { status: 'ok' } };
  }

  const referencePath = match[1];
  if (seen.includes(referencePath)) {
    return { value: undefined, meta: { status: 'cycle', unresolvedPath: referencePath } };
  }

  const node = getNestedValue(theme, referencePath.split('.'));
  if (node == null) {
    return { value: undefined, meta: { status: 'missing-ref', unresolvedPath: referencePath } };
  }

  if (isTokenNode(node)) {
    return resolveReferenceDetailed(node.$value, theme, [...seen, referencePath]);
  }

  if (typeof node === 'object') {
    return { value: undefined, meta: { status: 'invalid', unresolvedPath: referencePath } };
  }

  return { value: node, meta: { status: 'ok' } };
}

function flattenTokens(dictionary: TokenDictionary, path: string[] = []): RawTokenRow[] {
  const rows: RawTokenRow[] = [];

  Object.entries(dictionary).forEach(([key, value]) => {
    if (key.startsWith('$')) {
      return;
    }

    if (isTokenNode(value)) {
      const { $type, $value, $description } = value;

      if ($value && typeof $value === 'object' && !Array.isArray($value)) {
        Object.entries($value as Record<string, unknown>).forEach(([subKey, subValue]) => {
          rows.push({
            path: [...path, key, subKey],
            basePath: [...path, key],
            type: $type,
            reference: subValue,
            description: $description,
          });
        });
      } else if (Array.isArray($value)) {
        $value.forEach((item, index) => {
          rows.push({
            path: [...path, key, String(index)],
            basePath: [...path, key],
            type: $type,
            reference: item,
            description: $description,
          });
        });
      } else {
        rows.push({
          path: [...path, key],
          basePath: [...path, key],
          type: $type,
          reference: $value,
          description: $description,
        });
      }

      return;
    }

    if (value && typeof value === 'object') {
      rows.push(...flattenTokens(value as TokenDictionary, [...path, key]));
      return;
    }

    rows.push({
      path: [...path, key],
      basePath: [...path, key],
      type: 'invalid',
      reference: value,
      description: 'Invalid token shape',
      invalidNode: true,
    });
  });

  return rows;
}

function formatAlias(reference: unknown): string | undefined {
  if (typeof reference !== 'string') {
    return undefined;
  }

  const match = reference.match(REFERENCE_PATTERN);
  return match ? match[1] : undefined;
}

function formatLength(value: unknown): string | undefined {
  if (value == null) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  return String(value);
}

export function normalizeTypographyValue(value: unknown): string | undefined {
  if (value == null) {
    return undefined;
  }

  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value !== 'string') {
    return String(value);
  }

  if (/px$|rem$|em$|%$/.test(value)) {
    return value;
  }

  if (/^\d+(\.\d+)?$/.test(value)) {
    return `${value}px`;
  }

  return value;
}

export function normalizeTypographyWeight(value: unknown): CSSProperties['fontWeight'] {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  const map: Record<string, number> = {
    light: 300,
    regular: 380,
    medium: 570,
    semibold: 670,
  };

  if (map[normalized]) {
    return map[normalized];
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : value;
}

export function normalizeTypographyFamily(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined;
  }

  if (value.includes(',')) {
    return value;
  }

  return `"${value}", "Saans", sans-serif`;
}

export function formatRawValue(raw: unknown): string {
  if (raw == null) {
    return '—';
  }

  if (typeof raw === 'object') {
    return JSON.stringify(raw);
  }

  return String(raw);
}

function formatCompositeRawValue(type: string | undefined, values: Record<string, unknown>): string {
  if (type === 'typography') {
    const declarations: string[] = [];
    const family = values.fontFamily;
    const weight = values.fontWeight;
    const size = formatLength(values.fontSize);
    const lineHeight = formatLength(values.lineHeight);
    const letterSpacing = formatLength(values.letterSpacing);

    if (family) declarations.push(`font-family: ${family};`);
    if (weight) declarations.push(`font-weight: ${weight};`);
    if (size) declarations.push(`font-size: ${size};`);
    if (lineHeight) declarations.push(`line-height: ${lineHeight};`);
    if (letterSpacing) declarations.push(`letter-spacing: ${letterSpacing};`);

    return declarations.join(' ');
  }

  if (type === 'boxShadow') {
    const x = formatLength(values.x) ?? '0';
    const y = formatLength(values.y) ?? '0';
    const blur = formatLength(values.blur) ?? '0';
    const spread = formatLength(values.spread) ?? '0';
    const color = values.color ?? 'transparent';
    return `box-shadow: ${[x, y, blur, spread, color].join(' ')};`;
  }

  return JSON.stringify(values);
}

function formatCompositeDisplayPath(type: string | undefined, basePath: string[]): string | undefined {
  if (!type || !compositeTokenTypes.has(type)) {
    return undefined;
  }

  return [type, ...basePath].join('.');
}

function formatCompositeAlias(properties: RawTokenRow[]): string | undefined {
  const segments = properties
    .map((property) => {
      const propertyName = property.path[property.path.length - 1];
      const alias = formatAlias(property.reference) ?? (property.reference != null ? String(property.reference) : undefined);

      if (!alias) {
        return undefined;
      }

      return `${propertyName}: ${alias}`;
    })
    .filter(Boolean) as string[];

  return segments.length ? segments.join(' | ') : undefined;
}

function canonicalValue(value: unknown): string {
  if (value == null) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

export function getTypeSortRank(type?: string): number {
  if (!type) {
    return TYPE_SORT_ORDER.length + 1;
  }

  const index = TYPE_SORT_ORDER.indexOf(type as (typeof TYPE_SORT_ORDER)[number]);
  return index === -1 ? TYPE_SORT_ORDER.length : index;
}

export function compareByTypeThenPath(a: TokenRow, b: TokenRow): number {
  const byType = getTypeSortRank(a.type) - getTypeSortRank(b.type);
  if (byType !== 0) {
    return byType;
  }

  return a.path.join('.').localeCompare(b.path.join('.'));
}

function toTypeGroupId(type: string | undefined): string {
  return type ?? 'unknown';
}

function toTypeGroupLabel(type: string | undefined): string {
  const id = toTypeGroupId(type);
  return TYPE_LABELS[id] ?? id.charAt(0).toUpperCase() + id.slice(1);
}

export function buildRows(): TokenRow[] {
  const rawRows = flattenTokens(externalTokens as TokenDictionary);
  const compositeGroups = new Map<
    string,
    {
      basePath: string[];
      type?: string;
      description?: string;
      properties: RawTokenRow[];
    }
  >();
  const order: Array<{ key: string; composite: boolean; row?: RawTokenRow }> = [];

  rawRows.forEach((row) => {
    const isComposite = Boolean(row.type && compositeTokenTypes.has(row.type) && !row.invalidNode);

    if (isComposite) {
      const key = row.basePath.join('.');
      if (!compositeGroups.has(key)) {
        compositeGroups.set(key, {
          basePath: row.basePath,
          type: row.type,
          description: row.description,
          properties: [],
        });
        order.push({ key, composite: true });
      }

      compositeGroups.get(key)!.properties.push(row);
      return;
    }

    order.push({ key: row.path.join('.'), composite: false, row });
  });

  return order.map((entry) => {
    if (entry.composite) {
      const group = compositeGroups.get(entry.key);
      if (!group) {
        throw new Error(`Missing composite group for ${entry.key}`);
      }

      const compositeValues: Record<string, Record<string, unknown>> = {};
      const resolvedMetaByTheme: Record<string, ResolveMeta> = {};
      const resolvedValueByTheme: Record<string, unknown> = {};

      themeSlugs.forEach((themeSlug) => {
        const themeData = themeDataBySlug[themeSlug] ?? {};
        const resolvedProperties: Record<string, unknown> = {};
        const metas: ResolveMeta[] = [];

        group.properties.forEach((propertyRow) => {
          const propertyName = propertyRow.path[propertyRow.path.length - 1];
          const resolved = resolveReferenceDetailed(propertyRow.reference, themeData);
          resolvedProperties[propertyName] = resolved.value;
          metas.push(resolved.meta);
        });

        compositeValues[themeSlug] = resolvedProperties;
        resolvedMetaByTheme[themeSlug] = mergeMeta(metas);
        resolvedValueByTheme[themeSlug] = formatCompositeRawValue(group.type, resolvedProperties);
      });

      const values = Object.fromEntries(
        themeSlugs.map((slug) => [slug, resolvedValueByTheme[slug]])
      );

      return {
        path: group.basePath,
        basePath: group.basePath,
        type: group.type,
        reference: group.properties.map((propertyRow) => propertyRow.reference),
        description: group.description,
        alias: formatCompositeAlias(group.properties),
        cssVariable: toCssVariable(group.basePath),
        values,
        resolvedValueByTheme,
        resolvedMetaByTheme,
        compositeValues,
        compositeProperties: group.properties.map((property) => ({
          name: property.path[property.path.length - 1],
          reference: property.reference,
          alias: formatAlias(property.reference),
        })),
        displayPath: formatCompositeDisplayPath(group.type, group.basePath),
        isComposite: true,
      } satisfies TokenRow;
    }

    const row = entry.row!;
    const cssVariable = toCssVariable(row.path);
    const alias = formatAlias(row.reference);

    const resolvedValueByTheme: Record<string, unknown> = {};
    const resolvedMetaByTheme: Record<string, ResolveMeta> = {};

    themeSlugs.forEach((themeSlug) => {
      if (row.invalidNode) {
        resolvedValueByTheme[themeSlug] = row.reference;
        resolvedMetaByTheme[themeSlug] = { status: 'invalid', unresolvedPath: row.path.join('.') };
        return;
      }

      const resolved = resolveReferenceDetailed(row.reference, themeDataBySlug[themeSlug] ?? {});
      resolvedValueByTheme[themeSlug] = resolved.value;
      resolvedMetaByTheme[themeSlug] = resolved.meta;
    });

    const values = Object.fromEntries(themeSlugs.map((slug) => [slug, resolvedValueByTheme[slug]]));

    return {
      ...row,
      alias,
      cssVariable,
      values,
      resolvedValueByTheme,
      resolvedMetaByTheme,
      isComposite: false,
    } satisfies TokenRow;
  });
}

export const BASE_ROWS = buildRows();

function indexRowsByPath(rows: TokenRow[]): Record<string, TokenRow> {
  return Object.fromEntries(rows.map((row) => [row.path.join('.'), row]));
}

export function buildTokenSnapshot(rows: TokenRow[]): TokenSnapshot {
  const orderedRows = [...rows].sort((a, b) => a.path.join('.').localeCompare(b.path.join('.')));
  const tokens: Record<string, SnapshotTokenEntry> = {};

  orderedRows.forEach((row) => {
    const path = row.path.join('.');
    const valuesByTheme = Object.fromEntries(themeSlugs.map((slug) => [slug, row.resolvedValueByTheme[slug]]));
    tokens[path] = {
      type: row.type,
      alias: row.alias,
      cssVariable: row.cssVariable,
      valuesByTheme,
    };
  });

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    themes: [...themeSlugs],
    tokens,
  };
}

export function buildSnapshotDiff(rows: TokenRow[], snapshot: TokenSnapshot): SnapshotDiffResult {
  const rowMap = indexRowsByPath(rows);
  const baselineMap = snapshot.tokens ?? {};

  const summary: SnapshotDiffSummary = {
    added: 0,
    removed: 0,
    changed: 0,
    unchanged: 0,
  };

  const nextRows: TokenRow[] = rows.map((row) => {
    const path = row.path.join('.');
    const baseline = baselineMap[path];

    let diffStatus: SnapshotDiffStatus;

    if (!baseline) {
      diffStatus = 'added';
      summary.added += 1;
    } else {
      const changed =
        baseline.type !== row.type ||
        (baseline.alias ?? '') !== (row.alias ?? '') ||
        baseline.cssVariable !== row.cssVariable ||
        themeSlugs.some((slug) => canonicalValue(baseline.valuesByTheme?.[slug]) !== canonicalValue(row.resolvedValueByTheme[slug]));

      diffStatus = changed ? 'changed' : 'unchanged';
      if (changed) {
        summary.changed += 1;
      } else {
        summary.unchanged += 1;
      }
    }

    return {
      ...row,
      diffStatus,
    };
  });

  const removedRows: TokenRow[] = Object.entries(baselineMap)
    .filter(([path]) => !rowMap[path])
    .map(([path, baseline]) => {
      const segments = path.split('.');
      const resolvedMetaByTheme = Object.fromEntries(themeSlugs.map((slug) => [slug, { status: 'ok' }])) as Record<
        string,
        ResolveMeta
      >;
      const resolvedValueByTheme = Object.fromEntries(themeSlugs.map((slug) => [slug, baseline.valuesByTheme?.[slug]]));

      summary.removed += 1;

      return {
        path: segments,
        basePath: segments,
        type: baseline.type,
        reference: 'Removed from current tokens',
        description: 'This token exists in the committed snapshot but is no longer present in the current token source.',
        alias: baseline.alias,
        cssVariable: baseline.cssVariable,
        values: resolvedValueByTheme,
        resolvedValueByTheme,
        resolvedMetaByTheme,
        isComposite: false,
        diffStatus: 'removed',
      } satisfies TokenRow;
    });

  return {
    rows: [...nextRows, ...removedRows].sort((a, b) => a.path.join('.').localeCompare(b.path.join('.'))),
    summary,
  };
}

export function isColor(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  return /^#([0-9a-f]{3,8})$/i.test(value) || /^rgba?\(/i.test(value);
}

export function parseNumeric(value: unknown): number | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return undefined;
  }

  const numeric = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export function formatContrastValue(value: number | null): string {
  if (value == null) {
    return '—';
  }

  const rounded = value.toFixed(2);
  return rounded.replace(/\.?0+$/, '');
}

function parseHexColor(color: string): [number, number, number, number] | null {
  const hex = color.replace('#', '');

  if (![3, 4, 6, 8].includes(hex.length)) {
    return null;
  }

  const expand = (segment: string) => (segment.length === 1 ? `${segment}${segment}` : segment);

  if (hex.length <= 4) {
    const r = parseInt(expand(hex[0]), 16);
    const g = parseInt(expand(hex[1]), 16);
    const b = parseInt(expand(hex[2]), 16);
    const a = hex.length === 4 ? parseInt(expand(hex[3]), 16) / 255 : 1;
    return [r, g, b, a];
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;

  return [r, g, b, a];
}

function parseRgbColor(color: string): [number, number, number, number] | null {
  const match = color.match(/rgba?\(([^)]+)\)/i);
  if (!match) {
    return null;
  }

  const parts = match[1]
    .split(',')
    .map((part) => part.trim())
    .map((part) => Number.parseFloat(part));

  if (parts.length < 3 || parts.some((value) => Number.isNaN(value))) {
    return null;
  }

  return [parts[0], parts[1], parts[2], parts[3] ?? 1];
}

function parseColorToRgba(color: string): [number, number, number, number] | null {
  if (color.startsWith('#')) {
    return parseHexColor(color);
  }

  if (/^rgba?\(/i.test(color)) {
    return parseRgbColor(color);
  }

  return null;
}

function srgbToLinear(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([r, g, b]: [number, number, number, number]): number {
  const red = srgbToLinear(r);
  const green = srgbToLinear(g);
  const blue = srgbToLinear(b);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(foreground: string, background: string): number | null {
  const fg = parseColorToRgba(foreground);
  const bg = parseColorToRgba(background);

  if (!fg || !bg) {
    return null;
  }

  const [fr, fgColor, fb, fa] = fg;
  const [br, bgColor, bb] = bg;

  const blended = [
    fr * fa + br * (1 - fa),
    fgColor * fa + bgColor * (1 - fa),
    fb * fa + bb * (1 - fa),
    1,
  ] as [number, number, number, number];

  const l1 = relativeLuminance(blended);
  const l2 = relativeLuminance(bg);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function evaluateA11yForTheme(
  rows: TokenRow[],
  theme: ThemeSlug,
  rules: TokenA11yRule[] = TOKEN_A11Y_RULES
): A11yResult[] {
  const rowMap = indexRowsByPath(rows.filter((row) => row.diffStatus !== 'removed'));

  return rules.map((rule) => {
    const textValue = rowMap[rule.textTokenPath]?.resolvedValueByTheme[theme];
    const backgroundValue = rowMap[rule.backgroundTokenPath]?.resolvedValueByTheme[theme];

    if (!isColor(textValue) || !isColor(backgroundValue)) {
      return {
        ...rule,
        ratio: null,
        status: 'unknown',
        textColor: isColor(textValue) ? textValue : null,
        backgroundColor: isColor(backgroundValue) ? backgroundValue : null,
      };
    }

    const ratio = contrastRatio(textValue, backgroundValue);

    if (ratio == null) {
      return {
        ...rule,
        ratio: null,
        status: 'unknown',
        textColor: textValue,
        backgroundColor: backgroundValue,
      };
    }

    return {
      ...rule,
      ratio,
      status: ratio >= rule.minRatio ? 'pass' : 'fail',
      textColor: textValue,
      backgroundColor: backgroundValue,
    };
  });
}

function issueStatusForTheme(row: TokenRow, theme: ThemeSlug): ResolveStatus {
  return row.resolvedMetaByTheme[theme]?.status ?? 'ok';
}

export function isIssueRow(row: TokenRow): boolean {
  return themeSlugs.some((slug) => issueStatusForTheme(row, slug) !== 'ok');
}

export function issueLabel(meta: ResolveMeta): string {
  if (meta.status === 'missing-ref') {
    return 'Missing ref';
  }

  if (meta.status === 'cycle') {
    return 'Cycle';
  }

  if (meta.status === 'invalid') {
    return 'Invalid';
  }

  return 'OK';
}

export function groupRowsByType(rows: TokenRow[]): TokenTypeGroup[] {
  const groups = new Map<string, TokenTypeGroup>();

  rows.forEach((row) => {
    const groupId = toTypeGroupId(row.type);
    const existing = groups.get(groupId);
    const diffStatus = row.diffStatus ?? 'unchanged';

    if (!existing) {
      groups.set(groupId, {
        groupId,
        groupLabel: toTypeGroupLabel(row.type),
        rows: [row],
        count: 1,
        warningCount: isIssueRow(row) ? 1 : 0,
        diffCounts: {
          added: diffStatus === 'added' ? 1 : 0,
          removed: diffStatus === 'removed' ? 1 : 0,
          changed: diffStatus === 'changed' ? 1 : 0,
          unchanged: diffStatus === 'unchanged' ? 1 : 0,
        },
      });
      return;
    }

    existing.rows.push(row);
    existing.count += 1;
    existing.warningCount += isIssueRow(row) ? 1 : 0;
    existing.diffCounts[diffStatus] += 1;
  });

  return Array.from(groups.values()).sort((a, b) => {
    const rankA = getTypeSortRank(a.groupId === 'unknown' ? undefined : a.groupId);
    const rankB = getTypeSortRank(b.groupId === 'unknown' ? undefined : b.groupId);
    if (rankA !== rankB) {
      return rankA - rankB;
    }

    return a.groupLabel.localeCompare(b.groupLabel);
  });
}

export { designTokenManifest, themeSlugs };
