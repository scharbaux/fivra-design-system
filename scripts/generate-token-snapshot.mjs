import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = resolve(new URL('..', import.meta.url).pathname);
const externalTokens = JSON.parse(readFileSync(resolve(rootDir, 'src/tokens/Externals/Default.json'), 'utf8'));
const engageTokens = JSON.parse(readFileSync(resolve(rootDir, 'src/tokens/Internals/Engage.json'), 'utf8'));
const legacyTokens = JSON.parse(readFileSync(resolve(rootDir, 'src/tokens/Internals/Legacy.json'), 'utf8'));

const themes = {
  engage: engageTokens,
  legacy: legacyTokens,
};

const REFERENCE_PATTERN = /^\{(.+)\}$/;
const compositeTypes = new Set(['typography', 'boxShadow']);

function isTokenNode(value) {
  return Boolean(value && typeof value === 'object' && '$value' in value);
}

function getNestedValue(root, segments) {
  return segments.reduce((acc, segment) => {
    if (!acc || typeof acc !== 'object') return undefined;
    return acc[segment];
  }, root);
}

function resolveReference(value, theme, seen = []) {
  if (typeof value !== 'string') return value;

  const match = value.match(REFERENCE_PATTERN);
  if (!match) return value;

  const path = match[1];
  if (seen.includes(path)) return undefined;

  const node = getNestedValue(theme, path.split('.'));
  if (node == null) return undefined;

  if (isTokenNode(node)) {
    return resolveReference(node.$value, theme, [...seen, path]);
  }

  return typeof node === 'object' ? undefined : node;
}

function toCssVariable(path) {
  if (!path.length) return '';

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

function formatAlias(reference) {
  if (typeof reference !== 'string') return undefined;
  const match = reference.match(REFERENCE_PATTERN);
  return match ? match[1] : undefined;
}

function formatLength(value) {
  if (value == null) return undefined;
  if (typeof value === 'number') return `${value}px`;
  return String(value);
}

function formatCompositeRawValue(type, values) {
  if (type === 'typography') {
    const declarations = [];
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

function flattenTokens(dictionary, path = []) {
  const rows = [];

  Object.entries(dictionary).forEach(([key, value]) => {
    if (key.startsWith('$')) return;

    if (isTokenNode(value)) {
      const { $type, $value } = value;

      if ($value && typeof $value === 'object' && !Array.isArray($value)) {
        Object.entries($value).forEach(([subKey, subValue]) => {
          rows.push({
            path: [...path, key, subKey],
            basePath: [...path, key],
            type: $type,
            reference: subValue,
          });
        });
      } else if (Array.isArray($value)) {
        $value.forEach((item, index) => {
          rows.push({
            path: [...path, key, String(index)],
            basePath: [...path, key],
            type: $type,
            reference: item,
          });
        });
      } else {
        rows.push({
          path: [...path, key],
          basePath: [...path, key],
          type: $type,
          reference: $value,
        });
      }

      return;
    }

    if (value && typeof value === 'object') {
      rows.push(...flattenTokens(value, [...path, key]));
    }
  });

  return rows;
}

function buildRows() {
  const rawRows = flattenTokens(externalTokens);
  const compositeGroups = new Map();
  const ordered = [];

  rawRows.forEach((row) => {
    const isComposite = row.type && compositeTypes.has(row.type);

    if (isComposite) {
      const key = row.basePath.join('.');
      if (!compositeGroups.has(key)) {
        compositeGroups.set(key, { ...row, properties: [] });
        ordered.push({ key, composite: true });
      }
      compositeGroups.get(key).properties.push(row);
      return;
    }

    ordered.push({ key: row.path.join('.'), composite: false, row });
  });

  return ordered.map((entry) => {
    if (!entry.composite) {
      const row = entry.row;
      const valuesByTheme = Object.fromEntries(
        Object.entries(themes).map(([slug, themeData]) => [slug, resolveReference(row.reference, themeData)])
      );

      return {
        path: row.path,
        type: row.type,
        alias: formatAlias(row.reference),
        cssVariable: toCssVariable(row.path),
        valuesByTheme,
      };
    }

    const group = compositeGroups.get(entry.key);
    const valuesByTheme = Object.fromEntries(
      Object.entries(themes).map(([slug, themeData]) => {
        const compositeValues = {};
        group.properties.forEach((property) => {
          compositeValues[property.path[property.path.length - 1]] = resolveReference(property.reference, themeData);
        });

        return [slug, formatCompositeRawValue(group.type, compositeValues)];
      })
    );

    const alias = group.properties
      .map((property) => {
        const propName = property.path[property.path.length - 1];
        const aliasRef = formatAlias(property.reference) ?? (property.reference != null ? String(property.reference) : undefined);
        return aliasRef ? `${propName}: ${aliasRef}` : null;
      })
      .filter(Boolean)
      .join(' | ');

    return {
      path: group.basePath,
      type: group.type,
      alias: alias || undefined,
      cssVariable: toCssVariable(group.basePath),
      valuesByTheme,
    };
  });
}

const rows = buildRows().sort((a, b) => a.path.join('.').localeCompare(b.path.join('.')));
const tokens = Object.fromEntries(rows.map((row) => [row.path.join('.'), {
  type: row.type,
  alias: row.alias,
  cssVariable: row.cssVariable,
  valuesByTheme: row.valuesByTheme,
}]));

const snapshot = {
  version: 1,
  generatedAt: new Date().toISOString(),
  themes: Object.keys(themes),
  tokens,
};

const outputPath = resolve(rootDir, 'docs/foundations/token-snapshot.json');
writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outputPath}`);
