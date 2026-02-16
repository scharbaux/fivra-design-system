import { Fragment } from 'react';

import { Icon } from '@components';

import {
  formatRawValue,
  issueLabel,
  type ThemeSlug,
  type TokenRow,
  type TokenTypeGroup,
} from './TokensTable.model';
import { Specimen } from './TokensTableSpecimen';
import {
  cellStyle,
  codeWrapStyle,
  copyButtonStyle,
  copyGlyphStyle,
  copyValueStyle,
  diagnosticBadgeStyle,
  diffBadgeStyle,
  expandedCellStyle,
  expandedPanelStyle,
  groupChevronStyle,
  groupDiffAddedBadgeStyle,
  groupDiffChangedBadgeStyle,
  groupDiffRemovedBadgeStyle,
  groupHeaderButtonStyle,
  groupHeaderCellStyle,
  groupHeaderLabelWrapStyle,
  groupHeaderMetricsStyle,
  groupMetricBadgeStyle,
  groupWarningBadgeStyle,
  miniCellStyle,
  miniHeaderStyle,
  removedRowStyle,
  themeTabStyle,
  toggleButtonStyle,
} from './TokensTable.styles';

interface TokenRowFragmentProps {
  row: TokenRow;
  selectedTheme: ThemeSlug;
  copiedVariable: string | null;
  expandedRowSet: Set<string>;
  detailThemeByRow: Record<string, ThemeSlug>;
  onToggleRow: (rowKey: string) => void;
  onSetDetailTheme: (rowKey: string, theme: ThemeSlug) => void;
  onCopyCssVariable: (cssVariable: string) => void | Promise<void>;
  themeOptions: ReadonlyArray<{ slug: string; name: string }>;
}

export function TokenRowFragment({
  row,
  selectedTheme,
  copiedVariable,
  expandedRowSet,
  detailThemeByRow,
  onToggleRow,
  onSetDetailTheme,
  onCopyCssVariable,
  themeOptions,
}: TokenRowFragmentProps) {
  const rowKey = row.path.join('.');
  const expanded = expandedRowSet.has(rowKey);
  const activeDetailTheme = detailThemeByRow[rowKey] ?? selectedTheme;
  const meta = row.resolvedMetaByTheme[selectedTheme] ?? { status: 'ok' as const };

  return (
    <Fragment key={`${selectedTheme}-${rowKey}`}>
      <tr style={row.diffStatus === 'removed' ? removedRowStyle : undefined}>
        <td style={cellStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {row.isComposite ? (
              <button type="button" onClick={() => onToggleRow(rowKey)} style={toggleButtonStyle} aria-label="Toggle composite details">
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
            onClick={() => onCopyCssVariable(row.cssVariable)}
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
                {themeOptions.map((theme) => (
                  <button
                    key={`${rowKey}-${theme.slug}`}
                    type="button"
                    onClick={() => onSetDetailTheme(rowKey, theme.slug as ThemeSlug)}
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
}

interface TokenTypeGroupSectionProps {
  group: TokenTypeGroup;
  isExpanded: boolean;
  tableHeaderHeight: number;
  selectedTheme: ThemeSlug;
  copiedVariable: string | null;
  expandedRowSet: Set<string>;
  detailThemeByRow: Record<string, ThemeSlug>;
  onToggleGroup: (groupId: string) => void;
  onToggleRow: (rowKey: string) => void;
  onSetDetailTheme: (rowKey: string, theme: ThemeSlug) => void;
  onCopyCssVariable: (cssVariable: string) => void | Promise<void>;
  themeOptions: ReadonlyArray<{ slug: string; name: string }>;
}

export function TokenTypeGroupSection({
  group,
  isExpanded,
  tableHeaderHeight,
  selectedTheme,
  copiedVariable,
  expandedRowSet,
  detailThemeByRow,
  onToggleGroup,
  onToggleRow,
  onSetDetailTheme,
  onCopyCssVariable,
  themeOptions,
}: TokenTypeGroupSectionProps) {
  const groupBodyId = `tokens-group-${group.groupId}`;

  return (
    <tbody key={group.groupId} id={groupBodyId}>
      <tr>
        <td style={groupHeaderCellStyle(tableHeaderHeight)} colSpan={6}>
          <button
            type="button"
            onClick={() => onToggleGroup(group.groupId)}
            style={groupHeaderButtonStyle}
            className="tokens-group-toggle"
            aria-expanded={isExpanded}
            aria-controls={groupBodyId}
          >
            <span style={groupHeaderLabelWrapStyle}>
              <span style={groupChevronStyle(isExpanded)} aria-hidden="true">▾</span>
              <span>{group.groupLabel}</span>
            </span>
            <span style={groupHeaderMetricsStyle}>
              <span style={groupMetricBadgeStyle}>{group.count}</span>
              {group.warningCount > 0 ? <span style={groupWarningBadgeStyle}>{group.warningCount} warnings</span> : null}
              {group.diffCounts.added > 0 ? <span style={groupDiffAddedBadgeStyle}>+{group.diffCounts.added}</span> : null}
              {group.diffCounts.changed > 0 ? <span style={groupDiffChangedBadgeStyle}>~{group.diffCounts.changed}</span> : null}
              {group.diffCounts.removed > 0 ? <span style={groupDiffRemovedBadgeStyle}>-{group.diffCounts.removed}</span> : null}
            </span>
          </button>
        </td>
      </tr>
      {isExpanded
        ? group.rows.map((row) => (
            <TokenRowFragment
              key={`${selectedTheme}-${row.path.join('.')}`}
              row={row}
              selectedTheme={selectedTheme}
              copiedVariable={copiedVariable}
              expandedRowSet={expandedRowSet}
              detailThemeByRow={detailThemeByRow}
              onToggleRow={onToggleRow}
              onSetDetailTheme={onSetDetailTheme}
              onCopyCssVariable={onCopyCssVariable}
              themeOptions={themeOptions}
            />
          ))
        : null}
    </tbody>
  );
}
