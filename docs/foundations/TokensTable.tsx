import { Fragment, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { Icon } from '@components';
import { icons as generatedIcons } from '@shared/icons/icons.generated';
import { designTokenManifest } from '@styles/themes/tokens.generated';
import externalTokens from '@tokens/Externals/Default.json';
import engageTokens from '@tokens/Internals/Engage.json';
import legacyTokens from '@tokens/Internals/Legacy.json';
import tokenSnapshot from './token-snapshot.json';
import { TOKEN_A11Y_RULES, type TokenA11yRule } from './token-a11y-rules';
import { getCategoryIntro } from './token-category-intros';

const REFERENCE_PATTERN = /^\{(.+)\}$/;
const EXPANDED_ROWS_SESSION_KEY = 'docs.tokens.composite.expandedRows';

type ThemeSlug = typeof designTokenManifest.themes[number]['slug'];

type TokenDictionary = Record<string, unknown>;

type ResolveStatus = 'ok' | 'missing-ref' | 'cycle' | 'invalid';

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

type SnapshotDiffStatus = 'added' | 'removed' | 'changed' | 'unchanged';

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

interface TokenSnapshot {
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

interface SnapshotDiffResult {
  rows: TokenRow[];
  summary: SnapshotDiffSummary;
}

interface A11yResult {
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

const themeDataBySlug: Record<ThemeSlug, TokenDictionary> = {
  engage: engageTokens as TokenDictionary,
  legacy: legacyTokens as TokenDictionary,
};

const compositeTokenTypes = new Set(['typography', 'boxShadow']);
const numberLikeTypes = new Set(['spacing', 'borderWidth', 'borderRadius', 'dimension', 'number']);
const themeSlugs = designTokenManifest.themes.map((theme) => theme.slug) as ThemeSlug[];
const specimenIconName = Object.keys(generatedIcons).includes('chevron-right')
  ? 'chevron-right'
  : Object.keys(generatedIcons)[0] ?? '';
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

function normalizeTypographyValue(value: unknown): string | undefined {
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

function normalizeTypographyWeight(value: unknown): CSSProperties['fontWeight'] {
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

function normalizeTypographyFamily(value: unknown): string | undefined {
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

function getCompositeKey(row: TokenRow): string | undefined {
  if (!row.isComposite || !row.type || !compositeTokenTypes.has(row.type)) {
    return undefined;
  }

  return row.basePath.join('.');
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

function getTypeSortRank(type?: string): number {
  if (!type) {
    return TYPE_SORT_ORDER.length + 1;
  }

  const index = TYPE_SORT_ORDER.indexOf(type as (typeof TYPE_SORT_ORDER)[number]);
  return index === -1 ? TYPE_SORT_ORDER.length : index;
}

function compareByTypeThenPath(a: TokenRow, b: TokenRow): number {
  const byType = getTypeSortRank(a.type) - getTypeSortRank(b.type);
  if (byType !== 0) {
    return byType;
  }

  return a.path.join('.').localeCompare(b.path.join('.'));
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

const BASE_ROWS = buildRows();

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

function isColor(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  return /^#([0-9a-f]{3,8})$/i.test(value) || /^rgba?\(/i.test(value);
}

function parseNumeric(value: unknown): number | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return undefined;
  }

  const numeric = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function formatContrastValue(value: number | null): string {
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

function isIssueRow(row: TokenRow): boolean {
  return themeSlugs.some((slug) => issueStatusForTheme(row, slug) !== 'ok');
}

function issueLabel(meta: ResolveMeta): string {
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

async function copyToClipboard(value: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textArea);
  }
}

function Specimen({ row, theme }: { row: TokenRow; theme: ThemeSlug }): ReactNode {
  if (row.diffStatus === 'removed') {
    return <span style={{ color: '#7d8190', fontSize: '0.8rem' }}>removed</span>;
  }

  const value = row.resolvedValueByTheme[theme];
  const category = row.path[0]?.toLowerCase();

  if (isColor(value)) {
    if (category === 'background' || category === 'border' || category === 'text') {
      const whiteRatio = contrastRatio('#ffffff', value);
      const blackRatio = contrastRatio('#000000', value);

      return (
        <span
          style={{
            ...contrastSpecimenCardStyle,
            background: value,
            border: category === 'border' ? `3px solid ${value}` : '1px solid rgba(0,0,0,0.14)',
          }}
          aria-label={`Contrast sample. White: ${formatContrastValue(whiteRatio)}. Black: ${formatContrastValue(blackRatio)}.`}
        >
          <span style={contrastLeftValueStyle}>{formatContrastValue(whiteRatio)}</span>
          <span style={contrastRightValueStyle}>{formatContrastValue(blackRatio)}</span>
        </span>
      );
    }

    const sphereBase: CSSProperties = {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 1px 2px rgba(0,0,0,0.12)',
    };

    const sphereStyle: CSSProperties =
      category === 'border'
        ? {
            ...sphereBase,
            background: '#ffffff',
            border: `4px solid ${value}`,
          }
        : {
            ...sphereBase,
            background: value,
            border: '1px solid rgba(0,0,0,0.12)',
          };

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.75rem',
          height: '2.75rem',
          borderRadius: '999px',
          backgroundImage:
            'linear-gradient(45deg, #e4e6eb 25%, transparent 25%), linear-gradient(-45deg, #e4e6eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e4e6eb 75%), linear-gradient(-45deg, transparent 75%, #e4e6eb 75%)',
          backgroundSize: '10px 10px',
          backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
        }}
        aria-label={`Color swatch ${value}`}
      >
        <span style={sphereStyle} />
      </span>
    );
  }

  if (row.type && numberLikeTypes.has(row.type)) {
    const numeric = parseNumeric(value);
    if (numeric !== undefined) {
      const dimension = row.type === 'borderRadius' ? `${numeric}px` : undefined;
      const dimensionLabel = `${numeric}px`;

      if (row.type === 'borderRadius') {
        return (
          <span
            style={{
              display: 'inline-flex',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: dimension,
              border: '1px solid rgba(0,0,0,0.08)',
              background: '#f3f4fc',
            }}
            aria-label={`Border radius sample ${dimensionLabel}`}
          />
        );
      }

      if (row.type === 'borderWidth') {
        return (
          <span
            style={{
              display: 'inline-flex',
              width: '100%',
              height: '2.5rem',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f7f7f8',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '3rem',
                borderTop: `${dimensionLabel} solid #4c57ea`,
              }}
            />
          </span>
        );
      }

      if (category === 'iconsizes' && specimenIconName) {
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3.5rem',
              height: '2.5rem',
              background: '#f7f7f8',
              borderRadius: '0.5rem',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
            aria-label={`Icon size sample ${dimensionLabel}`}
          >
            <Icon name={specimenIconName} size={`${numeric}px`} color="#4c57ea" />
          </span>
        );
      }

      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '2.5rem',
            background: '#f7f7f8',
            borderRadius: '0.5rem',
            border: '1px solid rgba(0,0,0,0.08)',
          }}
          aria-label={`Scale sample ${dimensionLabel}`}
        >
          <span
            style={{
              display: 'inline-block',
              width: '0.6rem',
              height: `${Math.max(numeric, 1)}px`,
              background: '#4c57ea',
              borderRadius: '0.25rem',
            }}
          />
        </span>
      );
    }
  }

  if (row.type === 'opacity') {
    const numeric = parseNumeric(value);
    const opacity = numeric !== undefined ? numeric / (String(value).includes('%') ? 100 : 1) : 0;

    return (
      <span
        style={{
          display: 'inline-flex',
          width: '3.5rem',
          height: '2.5rem',
          borderRadius: '0.5rem',
          border: '1px solid rgba(0,0,0,0.08)',
          background: `linear-gradient(135deg, rgba(76,87,234,${opacity}) 0%, rgba(76,87,234,${Math.max(opacity - 0.2, 0)}) 100%)`,
        }}
        aria-label={`Opacity sample ${value}`}
      />
    );
  }

  if (row.type === 'typography') {
    const composite = row.compositeValues?.[theme];
    if (composite) {
      const style: CSSProperties = {
        fontFamily: normalizeTypographyFamily(composite.fontFamily),
        fontWeight: normalizeTypographyWeight(composite.fontWeight),
        fontSize: normalizeTypographyValue(composite.fontSize) as CSSProperties['fontSize'],
        lineHeight: normalizeTypographyValue(composite.lineHeight) as CSSProperties['lineHeight'],
        letterSpacing: normalizeTypographyValue(composite.letterSpacing) as CSSProperties['letterSpacing'],
        display: 'inline-flex',
        alignItems: 'center',
      };

      return (
        <span style={style} aria-label={`Typography sample for ${row.basePath.join('.')}`}>
          Aa
        </span>
      );
    }
  }

  if (row.type === 'boxShadow') {
    const composite = row.compositeValues?.[theme];
    if (composite) {
      const x = parseNumeric(composite.x) ?? 0;
      const y = parseNumeric(composite.y) ?? 0;
      const blur = parseNumeric(composite.blur) ?? 0;
      const spread = parseNumeric(composite.spread) ?? 0;
      const color = typeof composite.color === 'string' ? composite.color : 'rgba(0,0,0,0.2)';

      return (
        <span
          style={{
            display: 'inline-flex',
            width: '3.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            background: '#fff',
            boxShadow: `${x}px ${y}px ${blur}px ${spread}px ${color}`,
          }}
          aria-label={`Shadow sample for ${row.basePath.join('.')}`}
        />
      );
    }
  }

  return <span aria-hidden="true">—</span>;
}

function TokensTable() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeSlug>(themeSlugs[0] ?? 'engage');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');
  const [issuesOnly, setIssuesOnly] = useState(false);
  const [diffFilter, setDiffFilter] = useState<'all' | SnapshotDiffStatus>('all');
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>(() => {
    try {
      const cached = sessionStorage.getItem(EXPANDED_ROWS_SESSION_KEY);
      return cached ? (JSON.parse(cached) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [detailThemeByRow, setDetailThemeByRow] = useState<Record<string, ThemeSlug>>({});

  useEffect(() => {
    sessionStorage.setItem(EXPANDED_ROWS_SESSION_KEY, JSON.stringify(expandedRows));
  }, [expandedRows]);

  const diff = useMemo(
    () => buildSnapshotDiff(BASE_ROWS, tokenSnapshot as TokenSnapshot),
    []
  );

  const categories = useMemo(
    () => Array.from(new Set(diff.rows.map((row) => row.path[0]))).sort(),
    [diff.rows]
  );

  const filteredRows = useMemo(() => {
    const baseRows = selectedCategory === 'all' ? diff.rows : diff.rows.filter((row) => row.path[0] === selectedCategory);

    const diffScoped = diffFilter === 'all' ? baseRows : baseRows.filter((row) => row.diffStatus === diffFilter);
    const issueScoped = issuesOnly ? diffScoped.filter((row) => isIssueRow(row)) : diffScoped;

    const query = searchValue.trim().toLowerCase();
    const queryScoped = !query
      ? issueScoped
      : issueScoped.filter((row) => {
      const searchable = [
        row.displayPath ?? row.path.join('.'),
        row.alias ?? '',
        row.cssVariable,
        row.description ?? '',
        formatRawValue(row.resolvedValueByTheme[selectedTheme]),
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
    
    if (selectedCategory === 'all') {
      return [...queryScoped].sort(compareByTypeThenPath);
    }

    return queryScoped;
  }, [selectedCategory, diff.rows, diffFilter, issuesOnly, searchValue, selectedTheme]);

  const selectedThemeDefinition = useMemo(
    () => designTokenManifest.themes.find((theme) => theme.slug === selectedTheme) ?? designTokenManifest.themes[0],
    [selectedTheme]
  );

  const warningCount = useMemo(() => diff.rows.filter((row) => isIssueRow(row)).length, [diff.rows]);
  const expandedRowSet = useMemo(() => new Set(expandedRows), [expandedRows]);
  const intro = useMemo(() => getCategoryIntro(selectedCategory === 'all' ? 'all' : selectedCategory), [selectedCategory]);
  const a11yResults = useMemo(() => evaluateA11yForTheme(diff.rows, selectedTheme), [diff.rows, selectedTheme]);
  const snapshotIsStale = diff.summary.added > 0 || diff.summary.changed > 0 || diff.summary.removed > 0;

  const toggleRow = (key: string) => {
    setExpandedRows((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
    setDetailThemeByRow((current) => ({
      ...current,
      [key]: current[key] ?? selectedTheme,
    }));
  };

  return (
    <section aria-labelledby="tokens-reference" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{copyButtonInteractiveStyle}</style>
      <div style={summaryStripStyle}>
        <span style={summaryPillStyle}>{diff.rows.length} total</span>
        <span style={summaryPillStyle}>{warningCount} warnings</span>
        <button type="button" style={filterChipButtonStyle(issuesOnly)} onClick={() => setIssuesOnly(false)}>
          All
        </button>
        <button type="button" style={filterChipButtonStyle(!issuesOnly)} onClick={() => setIssuesOnly(true)}>
          Issues only
        </button>
        <span style={{ marginLeft: 'auto', ...summaryPillStyle }}>Snapshot: +{diff.summary.added} / ~{diff.summary.changed} / -{diff.summary.removed}</span>
      </div>
      {diffFilter === 'all' && snapshotIsStale ? (
        <div style={snapshotStaleStyle}>
          Snapshot stale: current tokens differ from <code>docs/foundations/token-snapshot.json</code>. Run{' '}
          <code>yarn generate:token-snapshot</code> after intentional token updates.
        </div>
      ) : null}

      <div style={introCardStyle}>
        <strong style={{ display: 'block', marginBottom: '0.3rem' }}>{intro.title}</strong>
        <p style={{ margin: 0 }}>{intro.body}</p>
        {intro.guidance ? <p style={{ margin: '0.35rem 0 0', color: '#666b78' }}>{intro.guidance}</p> : null}
      </div>

      <details style={a11yPanelStyle} open>
        <summary style={{ cursor: 'pointer', fontFamily: 'Nunito Sans', fontWeight: 600 }}>Accessibility helper (AA)</summary>
        <div style={{ marginTop: '0.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={miniHeaderStyle}>Pair</th>
                <th style={miniHeaderStyle}>Specimen</th>
                <th style={miniHeaderStyle}>Ratio</th>
                <th style={miniHeaderStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {a11yResults.map((result) => (
                <tr key={result.id}>
                  <td style={miniCellStyle}>{result.label}</td>
                  <td style={miniCellStyle}>
                    {result.textColor && result.backgroundColor ? (
                      <span
                        style={{
                          ...a11ySpecimenStyle(result.ratio),
                          background: result.backgroundColor,
                          color: result.textColor,
                        }}
                        aria-label={`A11y specimen ${result.textTokenPath} on ${result.backgroundTokenPath}`}
                      >
                        {result.ratio != null && result.ratio >= 3 && result.ratio < result.minRatio
                          ? 'Large text'
                          : 'Sample text'}
                      </span>
                    ) : (
                      <span style={{ color: '#8b90a0', fontSize: '0.78rem' }}>—</span>
                    )}
                  </td>
                  <td style={miniCellStyle}>{result.ratio == null ? '—' : result.ratio.toFixed(2)}</td>
                  <td style={miniCellStyle}>
                    <span style={a11yBadgeStyle(result.status)}>
                      {result.status === 'unknown' ? 'Unknown' : result.status === 'pass' ? 'Pass AA' : 'Fail AA'}
                    </span>
                    {result.ratio != null && result.ratio >= 3 && result.ratio < result.minRatio ? (
                      <span style={{ marginLeft: '0.4rem', color: '#6b7280', fontSize: '0.75rem' }}>Large text only</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <label style={filterLabelStyle}>
          <span style={filterLabelTextStyle}>Theme</span>
          <select value={selectedTheme} onChange={(event) => setSelectedTheme(event.target.value as ThemeSlug)} style={filterControlStyle}>
            {designTokenManifest.themes.map((theme) => (
              <option key={theme.slug} value={theme.slug}>
                {theme.name}
              </option>
            ))}
          </select>
        </label>
        <label style={filterLabelStyle}>
          <span style={filterLabelTextStyle}>Category</span>
          <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} style={filterControlStyle}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label style={filterLabelStyle}>
          <span style={filterLabelTextStyle}>Diff</span>
          <select value={diffFilter} onChange={(event) => setDiffFilter(event.target.value as 'all' | SnapshotDiffStatus)} style={filterControlStyle}>
            <option value="all">All</option>
            <option value="added">Added</option>
            <option value="changed">Changed</option>
            <option value="removed">Removed</option>
            <option value="unchanged">Unchanged</option>
          </select>
        </label>
        <label style={{ ...filterLabelStyle, flex: '1 1 16rem' }}>
          <span style={filterLabelTextStyle}>Search</span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Token, alias, value, CSS var..."
            style={{ ...filterControlStyle, width: '100%' }}
          />
        </label>
        <span style={resultsPillStyle}>{filteredRows.length} tokens</span>
      </div>

      <p style={{ color: '#585663', fontSize: '0.95rem', marginTop: 0 }}>
        Resolved values from the <code>{selectedThemeDefinition?.tokenSetCombination.internal}</code> Tokens Studio set merged with{' '}
        {selectedThemeDefinition?.tokenSetCombination.external.join(', ')}.
      </p>

      <div style={{ ...tableViewportStyle, flex: 1 }}>
        <div style={{ overflowY: 'auto', overflowX: 'hidden', height: '100%' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '16%' }} />
            </colgroup>
            <thead>
              <tr>
                <th style={headerCellStyle}>Token name</th>
                <th style={headerCellStyle}>Description</th>
                <th style={headerCellStyle}>Alias / Reference</th>
                <th style={headerCellStyle}>Raw value</th>
                <th style={headerCellStyle}>CSS variable</th>
                <th style={headerCellStyle}>Specimen</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const rowKey = row.path.join('.');
                const expanded = expandedRowSet.has(rowKey);
                const activeDetailTheme = detailThemeByRow[rowKey] ?? selectedTheme;
                const meta = row.resolvedMetaByTheme[selectedTheme] ?? { status: 'ok' as const };

                return (
                  <Fragment key={`${selectedTheme}-${rowKey}`}>
                    <tr key={`${selectedTheme}-${rowKey}`} style={row.diffStatus === 'removed' ? removedRowStyle : undefined}>
                      <td style={cellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {row.isComposite ? (
                            <button type="button" onClick={() => toggleRow(rowKey)} style={toggleButtonStyle} aria-label="Toggle composite details">
                              {expanded ? '▾' : '▸'}
                            </button>
                          ) : null}
                          <code style={codeWrapStyle}>{row.displayPath ?? row.path.join('.')}</code>
                          {meta.status !== 'ok' ? <span style={diagnosticBadgeStyle(meta.status)}>{issueLabel(meta)}</span> : null}
                          {row.diffStatus && row.diffStatus !== 'unchanged' ? (
                            <span style={diffBadgeStyle(row.diffStatus)}>{row.diffStatus}</span>
                          ) : null}
                        </div>
                      </td>
                      <td style={cellStyle}>{row.description ?? '—'}</td>
                      <td style={cellStyle}>{row.alias ? <code style={codeWrapStyle}>{row.alias}</code> : '—'}</td>
                      <td style={cellStyle}>
                        <code style={codeWrapStyle}>{formatRawValue(row.resolvedValueByTheme[selectedTheme])}</code>
                      </td>
                      <td style={cellStyle}>
                        <button
                          type="button"
                          onClick={async () => {
                            await copyToClipboard(row.cssVariable);
                            setCopiedVariable(row.cssVariable);
                            window.setTimeout(() => {
                              setCopiedVariable((current) => (current === row.cssVariable ? null : current));
                            }, 1200);
                          }}
                          style={copyButtonStyle}
                          className={`tokens-copy-button${copiedVariable === row.cssVariable ? ' is-copied' : ''}`}
                          title={`Copy ${row.cssVariable}`}
                        >
                          <code style={{ ...codeWrapStyle, ...copyValueStyle }}>{row.cssVariable}</code>
                          <span className="tokens-copy-glyph" style={copyGlyphStyle} aria-hidden="true">
                            <Icon name="copy" variant="solid" size={14} color="#5f6470" />
                          </span>
                        </button>
                      </td>
                      <td style={{ ...cellStyle, textAlign: 'center' }}>
                        <Specimen row={row} theme={selectedTheme} />
                      </td>
                    </tr>
                    {row.isComposite && expanded ? (
                      <tr>
                        <td style={expandedCellStyle} colSpan={6}>
                          <div style={expandedPanelStyle}>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              {designTokenManifest.themes.map((theme) => (
                                <button
                                  key={`${rowKey}-${theme.slug}`}
                                  type="button"
                                  onClick={() =>
                                    setDetailThemeByRow((current) => ({
                                      ...current,
                                      [rowKey]: theme.slug as ThemeSlug,
                                    }))
                                  }
                                  style={themeTabStyle(activeDetailTheme === theme.slug)}
                                >
                                  {theme.name}
                                </button>
                              ))}
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr>
                                  <th style={miniHeaderStyle}>Property</th>
                                  <th style={miniHeaderStyle}>Alias</th>
                                  <th style={miniHeaderStyle}>Resolved ({activeDetailTheme})</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(row.compositeProperties ?? []).map((property) => (
                                  <tr key={`${rowKey}-${property.name}`}>
                                    <td style={miniCellStyle}><code>{property.name}</code></td>
                                    <td style={miniCellStyle}>{property.alias ? <code>{property.alias}</code> : '—'}</td>
                                    <td style={miniCellStyle}>
                                      <code style={codeWrapStyle}>{formatRawValue(row.compositeValues?.[activeDetailTheme]?.[property.name])}</code>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const summaryStripStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginBottom: '0.6rem',
};

const summaryPillStyle: CSSProperties = {
  fontSize: '0.78rem',
  color: '#5b6070',
  background: '#f4f5f8',
  borderRadius: '999px',
  padding: '0.22rem 0.55rem',
};

const filterChipButtonStyle = (active: boolean): CSSProperties => ({
  border: `1px solid ${active ? '#3f5efb' : 'rgba(0,0,0,0.14)'}`,
  background: active ? '#eef2ff' : '#fff',
  color: active ? '#293683' : '#2f3442',
  borderRadius: '999px',
  padding: '0.24rem 0.62rem',
  fontSize: '0.78rem',
  cursor: 'pointer',
});

const introCardStyle: CSSProperties = {
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: '0.6rem',
  padding: '0.65rem 0.8rem',
  background: '#fafbff',
  color: '#353a47',
  marginBottom: '0.65rem',
  fontSize: '0.9rem',
};

const snapshotStaleStyle: CSSProperties = {
  border: '1px solid #f3c869',
  background: '#fff8e8',
  color: '#6a4b00',
  borderRadius: '0.6rem',
  padding: '0.55rem 0.75rem',
  marginBottom: '0.65rem',
  fontSize: '0.85rem',
};

const a11yPanelStyle: CSSProperties = {
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: '0.6rem',
  padding: '0.6rem 0.75rem',
  marginBottom: '0.75rem',
  background: '#fff',
};

const a11yBadgeStyle = (status: A11yResult['status']): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '0.72rem',
  borderRadius: '999px',
  padding: '0.18rem 0.45rem',
  background: status === 'pass' ? '#e9f8ef' : status === 'fail' ? '#fdeced' : '#f3f4f6',
  color: status === 'pass' ? '#0f6f3f' : status === 'fail' ? '#8e1f28' : '#5f6470',
});

const a11ySpecimenStyle = (ratio: number | null): CSSProperties => {
  const largeTextOnly = ratio != null && ratio >= 3 && ratio < 4.5;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '7.4rem',
    height: largeTextOnly ? '2rem' : '1.8rem',
    borderRadius: '0.4rem',
    border: '1px solid rgba(0,0,0,0.14)',
    fontWeight: 700,
    fontSize: largeTextOnly ? '1.05rem' : '0.86rem',
    lineHeight: 1,
    padding: '0 0.4rem',
  };
};

const tableViewportStyle: CSSProperties = {
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '0.75rem',
  overflow: 'hidden',
  minHeight: '28rem',
  background: '#fff',
};

const filterLabelStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const filterLabelTextStyle: CSSProperties = {
  color: '#585663',
  fontSize: '0.8rem',
};

const filterControlStyle: CSSProperties = {
  border: '1px solid rgba(0, 0, 0, 0.15)',
  borderRadius: '0.4rem',
  padding: '0.35rem 0.55rem',
  background: '#fff',
  fontSize: '0.9rem',
};

const resultsPillStyle: CSSProperties = {
  marginLeft: 'auto',
  fontSize: '0.8rem',
  color: '#585663',
  background: '#f3f4f8',
  borderRadius: '999px',
  padding: '0.2rem 0.55rem',
};

const headerCellStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 1,
  textAlign: 'left',
  padding: '0.75rem',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
  fontWeight: 600,
  background: '#f7f7f8',
  whiteSpace: 'nowrap',
};

const cellStyle: CSSProperties = {
  padding: '0.75rem',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
  verticalAlign: 'top',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
};

const removedRowStyle: CSSProperties = {
  opacity: 0.8,
  background: '#fff9f9',
};

const codeWrapStyle: CSSProperties = {
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
};

const copyButtonStyle: CSSProperties = {
  display: 'inline-block',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: '0.45rem',
  background: '#ffffff',
  color: '#20232a',
  padding: '0.35rem 0.45rem',
  cursor: 'pointer',
  font: 'inherit',
  textAlign: 'left',
  position: 'relative',
  width: '100%',
};

const copyValueStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  paddingRight: '2rem',
};

const copyButtonInteractiveStyle = `
  .tokens-copy-button:hover,
  .tokens-copy-button:focus-visible {
    background: #f7f7f8!important;
    border-color: rgba(0,0,0,0.18);
  }

  .tokens-copy-button .tokens-copy-glyph {
    opacity: 0;
    transform: translateY(-50%) scale(0.96);
    transition: opacity 140ms ease, transform 140ms ease;
  }

  .tokens-copy-button:hover .tokens-copy-glyph,
  .tokens-copy-button:focus-visible .tokens-copy-glyph {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }

  .tokens-copy-button.is-copied::after {
    content: "Copied";
    position: absolute;
    top: -1.42rem;
    right: 0.45rem;
    background: #2e3440;
    color: #ffffff;
    border-radius: 0.35rem;
    padding: 0.15rem 0.35rem;
    font-size: 0.68rem;
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
    z-index: 2;
  }
`;

const copyGlyphStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.35rem',
  height: '1.35rem',
  borderRadius: '0.25rem',
  border: '1px solid rgba(0,0,0,0.16)',
  background: '#fff',
  color: '#5f6470',
  flexShrink: 0,
  position: 'absolute',
  top: '50%',
  right: '0.45rem',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
};

const contrastSpecimenCardStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  minWidth: '9.25rem',
  height: '2.8rem',
  borderRadius: '0.45rem',
  padding: '0 0.65rem',
  boxSizing: 'border-box',
};

const contrastLeftValueStyle: CSSProperties = {
  fontWeight: 700,
  color: '#ffffff',
  fontSize: '1rem',
  textShadow: '0 1px 1px rgba(0,0,0,0.2)',
};

const contrastRightValueStyle: CSSProperties = {
  fontWeight: 700,
  color: '#000000',
  fontSize: '1rem',
};

const toggleButtonStyle: CSSProperties = {
  border: '1px solid rgba(0,0,0,0.14)',
  borderRadius: '0.3rem',
  background: '#fff',
  color: '#303645',
  cursor: 'pointer',
  fontSize: '0.72rem',
  lineHeight: 1,
  padding: '0.2rem 0.32rem',
};

const diagnosticBadgeStyle = (status: ResolveStatus): CSSProperties => ({
  borderRadius: '999px',
  fontSize: '0.68rem',
  padding: '0.08rem 0.45rem',
  background: status === 'missing-ref' ? '#fff4e5' : status === 'cycle' ? '#fceef3' : '#fdeceb',
  color: status === 'missing-ref' ? '#8c5a1b' : status === 'cycle' ? '#8a2a4b' : '#8e1f28',
});

const diffBadgeStyle = (status: SnapshotDiffStatus): CSSProperties => ({
  borderRadius: '4px',
  fontSize: '0.8rem',
  fontWeight: 570,
  lineHeight: '1rem',
  padding: '0.16rem 0.45rem',
  background:
    status === 'added'
      ? '#e9f8ef'
      : status === 'changed'
      ? '#eef2ff'
      : status === 'removed'
      ? '#fdeceb'
      : '#f3f4f6',
  color:
    status === 'added'
      ? '#0f6f3f'
      : status === 'changed'
      ? '#293683'
      : status === 'removed'
      ? '#8e1f28'
      : '#5f6470',
});

const expandedCellStyle: CSSProperties = {
  ...cellStyle,
  background: '#fcfcfe',
  paddingTop: 0,
};

const expandedPanelStyle: CSSProperties = {
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: '0.55rem',
  background: '#fff',
  padding: '0.65rem',
};

const themeTabStyle = (active: boolean): CSSProperties => ({
  border: `1px solid ${active ? '#3f5efb' : 'rgba(0,0,0,0.14)'}`,
  background: active ? '#eef2ff' : '#fff',
  color: active ? '#293683' : '#2f3442',
  borderRadius: '0.45rem',
  padding: '0.2rem 0.5rem',
  fontSize: '0.78rem',
  cursor: 'pointer',
});

const miniHeaderStyle: CSSProperties = {
  textAlign: 'left',
  padding: '0.4rem 0.5rem',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
  fontWeight: 600,
  fontSize: '0.78rem',
  color: '#515768',
};

const miniCellStyle: CSSProperties = {
  padding: '0.4rem 0.5rem',
  borderBottom: '1px solid rgba(0,0,0,0.06)',
  fontSize: '0.82rem',
  color: '#2f3442',
  verticalAlign: 'top',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
};

export default TokensTable;
