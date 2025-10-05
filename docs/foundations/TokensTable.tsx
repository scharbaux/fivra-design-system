import { Fragment, useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { designTokenManifest } from '../../src/styles/themes/tokens.generated';
import externalTokens from '../../src/tokens/Externals/Default.json';
import engageTokens from '../../src/tokens/Internals/Engage.json';
import legacyTokens from '../../src/tokens/Internals/Legacy.json';

const REFERENCE_PATTERN = /^\{(.+)\}$/;

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
}

interface TokenRow extends RawTokenRow {
  alias?: string;
  cssVariable: string;
  values: Record<string, unknown>;
  compositeValues?: Record<string, Record<string, unknown>>;
  displayPath?: string;
}

type TokenDictionary = Record<string, unknown>;

type ThemeSlug = typeof designTokenManifest.themes[number]['slug'];

const themeDataBySlug: Record<ThemeSlug, TokenDictionary> = {
  engage: engageTokens as TokenDictionary,
  legacy: legacyTokens as TokenDictionary,
};

const compositeTokenTypes = new Set(['typography', 'boxShadow']);

const numberLikeTypes = new Set([
  'spacing',
  'borderWidth',
  'borderRadius',
  'dimension',
  'number',
]);

function isTokenNode(value: unknown): value is TokenNode {
  return Boolean(value && typeof value === 'object' && '$value' in (value as Record<string, unknown>));
}

function toCssVariable(path: string[]): string {
  if (!path.length) {
    return '';
  }

  const normalized = path.map((segment) => {
    const cleaned = segment
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    return cleaned || segment;
  });

  normalized[0] = normalized[0].charAt(0).toLowerCase() + normalized[0].slice(1);

  return `--${normalized.join('')}`;
}

function getNestedValue(root: TokenDictionary, segments: string[]): unknown {
  return segments.reduce<unknown>((acc, segment) => {
    if (!acc || typeof acc !== 'object') {
      return undefined;
    }

    return (acc as Record<string, unknown>)[segment];
  }, root);
}

function resolveReference(value: unknown, theme: TokenDictionary, seen: Set<string> = new Set()): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const match = value.match(REFERENCE_PATTERN);

  if (!match) {
    return value;
  }

  const path = match[1];

  if (seen.has(path)) {
    return undefined;
  }

  seen.add(path);
  const segments = path.split('.');
  const node = getNestedValue(theme, segments);

  if (!node) {
    return undefined;
  }

  if (isTokenNode(node)) {
    return resolveReference(node.$value, theme, seen);
  }

  return node;
}

function flattenTokens(dictionary: TokenDictionary, path: string[] = [], base: string[] = []): RawTokenRow[] {
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
      rows.push(...flattenTokens(value as TokenDictionary, [...path, key], base.length ? base : path));
    }
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

function formatRawValue(raw: unknown): string {
  if (raw == null) {
    return '—';
  }

  if (typeof raw === 'object') {
    return JSON.stringify(raw);
  }

  return String(raw);
}

function isColor(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  return /^#([0-9a-f]{3,8})$/i.test(value) || value.startsWith('rgb');
}

function parseNumeric(value: unknown): number | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return undefined;
  }

  const numeric = typeof value === 'number' ? value : parseFloat(value);

  return Number.isFinite(numeric) ? numeric : undefined;
}

function getCompositeKey(row: TokenRow): string | undefined {
  if (!compositeTokenTypes.has(row.type ?? '')) {
    return undefined;
  }

  return row.basePath.join('.');
}

function normalizeTypographyValue(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  if (/px$|rem$|em$/.test(value) || /^\d+(\.\d+)?$/.test(value)) {
    return value;
  }

  return value;
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

  if (!segments.length) {
    return undefined;
  }

  return segments.join(' | ');
}

function formatCompositeDisplayPath(type: string | undefined, basePath: string[]): string | undefined {
  if (!type || !compositeTokenTypes.has(type)) {
    return undefined;
  }

  return [type, ...basePath].join('.');
}

function formatCompositeRawValue(type: string | undefined, values: Record<string, unknown>): string {
  if (type === 'typography') {
    const declarations: string[] = [];
    const family = values.fontFamily;
    const weight = values.fontWeight;
    const size = formatLength(values.fontSize);
    const lineHeight = formatLength(values.lineHeight);
    const letterSpacing = formatLength(values.letterSpacing);

    if (family) {
      declarations.push(`font-family: ${family};`);
    }

    if (weight) {
      declarations.push(`font-weight: ${weight};`);
    }

    if (size) {
      declarations.push(`font-size: ${size};`);
    }

    if (lineHeight) {
      declarations.push(`line-height: ${lineHeight};`);
    }

    if (letterSpacing) {
      declarations.push(`letter-spacing: ${letterSpacing};`);
    }

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
    const isComposite = row.type && compositeTokenTypes.has(row.type);

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
      const values: Record<string, string> = {};

      designTokenManifest.themes.forEach((theme) => {
        const themeData = themeDataBySlug[theme.slug] ?? {};
        const resolvedProperties: Record<string, unknown> = {};

        group.properties.forEach((propertyRow) => {
          const propertyName = propertyRow.path[propertyRow.path.length - 1];
          resolvedProperties[propertyName] = resolveReference(propertyRow.reference, themeData);
        });

        compositeValues[theme.slug] = resolvedProperties;
        values[theme.slug] = formatCompositeRawValue(group.type, resolvedProperties);
      });

      return {
        path: group.basePath,
        basePath: group.basePath,
        type: group.type,
        reference: group.properties.map((propertyRow) => propertyRow.reference),
        description: group.description,
        alias: formatCompositeAlias(group.properties),
        cssVariable: toCssVariable(group.basePath),
        values,
        compositeValues,
        displayPath: formatCompositeDisplayPath(group.type, group.basePath),
      } satisfies TokenRow;
    }

    const row = entry.row!;
    const cssVariable = toCssVariable(row.path);
    const alias = formatAlias(row.reference);

    const values = Object.fromEntries(
      designTokenManifest.themes.map((theme) => {
        const themeData = themeDataBySlug[theme.slug];
        const resolved = resolveReference(row.reference, themeData ?? {});

        return [theme.slug, resolved];
      })
    );

    return {
      ...row,
      alias,
      cssVariable,
      values,
    } satisfies TokenRow;
  });
}

const rows = buildRows();

const rowsByCategory = rows.reduce<Record<string, TokenRow[]>>((acc, row) => {
  const category = row.path[0];
  if (!acc[category]) {
    acc[category] = [];
  }

  acc[category].push(row);
  return acc;
}, {});

const compositeValuesByTheme: Record<string, Record<string, Record<string, unknown>>> = {};

designTokenManifest.themes.forEach((theme) => {
  compositeValuesByTheme[theme.slug] = {};
});

rows.forEach((row) => {
  const compositeKey = getCompositeKey(row);

  if (!compositeKey || !row.compositeValues) {
    return;
  }

  designTokenManifest.themes.forEach((theme) => {
    const valuesForTheme = row.compositeValues?.[theme.slug];

    if (!valuesForTheme) {
      return;
    }

    compositeValuesByTheme[theme.slug][compositeKey] = valuesForTheme;
  });
});

function Specimen({ row, theme }: { row: TokenRow; theme: ThemeSlug }): ReactNode {
  const value = row.values[theme];

  if (isColor(value)) {
    return (
      <span
        style={{
          display: 'inline-flex',
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '0.75rem',
          border: '1px solid rgba(0,0,0,0.08)',
          background: value,
        }}
        aria-label={`Color swatch ${value}`}
      />
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
          aria-label={`Scale sample ${dimensionLabel}`}
        >
          <span
            style={{
              display: 'inline-block',
              width: '0.6rem',
              height: `${Math.max(8, Math.min(numeric, 48))}px`,
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
          background: `linear-gradient(135deg, rgba(76,87,234,${opacity}) 0%, rgba(76,87,234,${Math.max(
            opacity - 0.2,
            0
          )}) 100%)`,
        }}
        aria-label={`Opacity sample ${value}`}
      />
    );
  }

  if (row.type === 'typography') {
    const compositeKey = getCompositeKey(row);
    const composite = compositeKey ? compositeValuesByTheme[theme][compositeKey] : undefined;

    if (composite) {
      const style: CSSProperties = {
        fontFamily: composite.fontFamily as string | undefined,
        fontWeight: composite.fontWeight as CSSProperties['fontWeight'],
        fontSize: normalizeTypographyValue(composite.fontSize) as CSSProperties['fontSize'],
        lineHeight: normalizeTypographyValue(composite.lineHeight) as CSSProperties['lineHeight'],
        letterSpacing: normalizeTypographyValue(composite.letterSpacing) as CSSProperties['letterSpacing'],
        display: 'inline-flex',
        alignItems: 'center',
      };

      return (
        <span style={style} aria-label={`Typography sample for ${compositeKey}`}>
          Aa
        </span>
      );
    }
  }

  if (row.type === 'boxShadow') {
    const compositeKey = getCompositeKey(row);
    const composite = compositeKey ? compositeValuesByTheme[theme][compositeKey] : undefined;

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
          aria-label={`Shadow sample for ${compositeKey}`}
        />
      );
    }
  }

  return <span aria-hidden="true">—</span>;
}

function TokensTable() {
  const categories = useMemo(() => Object.keys(rowsByCategory).sort(), []);

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {designTokenManifest.themes.map((theme) => (
        <section key={theme.slug} aria-labelledby={`tokens-${theme.slug}`}>
          <h2 id={`tokens-${theme.slug}`}>{theme.name} theme</h2>
          <p style={{ color: '#585663', fontSize: '0.95rem' }}>
            Resolved values from the <code>{theme.tokenSetCombination.internal}</code> Tokens Studio set merged with{' '}
            {theme.tokenSetCombination.external.join(', ')}.
          </p>

          {categories.map((category) => {
            const categoryRows = rowsByCategory[category];

            return (
              <Fragment key={`${theme.slug}-${category}`}>
                <h3 style={{ marginTop: '1.5rem' }}>{category}</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
                    <thead>
                      <tr>
                        <th style={headerCellStyle}>Token name</th>
                        <th style={headerCellStyle}>Alias / Reference</th>
                        <th style={headerCellStyle}>Raw value</th>
                        <th style={headerCellStyle}>CSS variable</th>
                        <th style={headerCellStyle}>Specimen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryRows.map((row) => (
                        <tr key={`${theme.slug}-${row.path.join('.')}`}>
                          <td style={cellStyle}>
                            <code>{row.displayPath ?? row.path.join('.')}</code>
                            {row.description ? (
                              <div style={{ color: '#706e7b', fontSize: '0.8rem', marginTop: '0.25rem' }}>{row.description}</div>
                            ) : null}
                          </td>
                          <td style={cellStyle}>{row.alias ? <code>{row.alias}</code> : '—'}</td>
                          <td style={cellStyle}>
                            <code>{formatRawValue(row.values[theme.slug])}</code>
                          </td>
                          <td style={cellStyle}>
                            <code>{row.cssVariable}</code>
                          </td>
                          <td style={{ ...cellStyle, textAlign: 'center' }}>
                            <Specimen row={row} theme={theme.slug} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Fragment>
            );
          })}
        </section>
      ))}
    </div>
  );
}

const headerCellStyle: CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
  fontWeight: 600,
  background: '#f7f7f8',
};

const cellStyle: CSSProperties = {
  padding: '0.75rem',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
  verticalAlign: 'top',
};

export default TokensTable;
