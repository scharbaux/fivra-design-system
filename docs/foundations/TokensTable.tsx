import { useEffect, useMemo, useRef, useState } from 'react';

import tokenSnapshot from './token-snapshot.json';
import { getCategoryIntro } from './token-category-intros';
import {
  BASE_ROWS,
  buildRows,
  buildSnapshotDiff,
  buildTokenSnapshot,
  compareByTypeThenPath,
  contrastRatio,
  designTokenManifest,
  evaluateA11yForTheme,
  formatRawValue,
  groupRowsByType,
  isIssueRow,
  resolveReferenceDetailed,
  type SnapshotDiffStatus,
  type ThemeSlug,
  type TokenSnapshot,
} from './TokensTable.model';
import { TokenRowFragment, TokenTypeGroupSection } from './TokensTableRows';
import {
  a11yBadgeStyle,
  a11yPanelStyle,
  a11ySpecimenStyle,
  copyButtonInteractiveStyle,
  filterChipButtonStyle,
  filterControlStyle,
  filterLabelStyle,
  filterLabelTextStyle,
  headerCellStyle,
  introCardStyle,
  miniCellStyle,
  miniHeaderStyle,
  resultsPillStyle,
  snapshotStaleStyle,
  summaryPillStyle,
  summaryStripStyle,
  tableViewportStyle,
} from './TokensTable.styles';

const EXPANDED_ROWS_SESSION_KEY = 'docs.tokens.composite.expandedRows';
const EXPANDED_GROUPS_SESSION_KEY = 'docs.tokens.typeAccordion.expandedGroups';

function copyToClipboard(value: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(value);
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

  return Promise.resolve();
}

function TokensTable() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeSlug>('engage');
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
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    try {
      const cached = sessionStorage.getItem(EXPANDED_GROUPS_SESSION_KEY);
      return cached ? (JSON.parse(cached) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [tableHeaderHeight, setTableHeaderHeight] = useState<number>(48);
  const tableHeaderRef = useRef<HTMLTableSectionElement | null>(null);

  useEffect(() => {
    sessionStorage.setItem(EXPANDED_ROWS_SESSION_KEY, JSON.stringify(expandedRows));
  }, [expandedRows]);

  useEffect(() => {
    sessionStorage.setItem(EXPANDED_GROUPS_SESSION_KEY, JSON.stringify(expandedGroups));
  }, [expandedGroups]);

  const diff = useMemo(() => buildSnapshotDiff(BASE_ROWS, tokenSnapshot as TokenSnapshot), []);

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

  const groupedRows = useMemo(() => groupRowsByType(filteredRows), [filteredRows]);

  const selectedThemeDefinition = useMemo(
    () =>
      designTokenManifest.themes.find((theme) => theme.slug === selectedTheme) ?? designTokenManifest.themes[0],
    [selectedTheme]
  );

  const warningCount = useMemo(() => diff.rows.filter((row) => isIssueRow(row)).length, [diff.rows]);
  const expandedRowSet = useMemo(() => new Set(expandedRows), [expandedRows]);
  const intro = useMemo(() => getCategoryIntro(selectedCategory === 'all' ? 'all' : selectedCategory), [selectedCategory]);
  const a11yResults = useMemo(() => evaluateA11yForTheme(diff.rows, selectedTheme), [diff.rows, selectedTheme]);
  const snapshotIsStale = diff.summary.added > 0 || diff.summary.changed > 0 || diff.summary.removed > 0;
  const expandedGroupSet = useMemo(() => new Set(expandedGroups), [expandedGroups]);

  useEffect(() => {
    if (!groupedRows.length) {
      return;
    }

    const ids = groupedRows.map((group) => group.groupId);
    setExpandedGroups((current) => {
      const nextSet = new Set(current);
      let changed = false;

      ids.forEach((id) => {
        if (!nextSet.has(id)) {
          nextSet.add(id);
          changed = true;
        }
      });

      return changed ? Array.from(nextSet) : current;
    });
  }, [groupedRows]);

  useEffect(() => {
    const measure = () => {
      const headerRow = tableHeaderRef.current?.querySelector('tr');
      if (!headerRow) {
        return;
      }

      const measured = headerRow.getBoundingClientRect().height;
      if (measured > 0) {
        setTableHeaderHeight(measured);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
    };
  }, []);

  const toggleRow = (key: string) => {
    setExpandedRows((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
    setDetailThemeByRow((current) => ({
      ...current,
      [key]: current[key] ?? selectedTheme,
    }));
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((current) =>
      current.includes(groupId) ? current.filter((item) => item !== groupId) : [...current, groupId]
    );
  };

  const handleSetDetailTheme = (rowKey: string, theme: ThemeSlug) => {
    setDetailThemeByRow((current) => ({
      ...current,
      [rowKey]: theme,
    }));
  };

  const handleCopyCssVariable = async (cssVariable: string) => {
    await copyToClipboard(cssVariable);
    setCopiedVariable(cssVariable);
    window.setTimeout(() => {
      setCopiedVariable((current) => (current === cssVariable ? null : current));
    }, 1200);
  };

  return (
    <section aria-labelledby="tokens-reference" style={{ width: '100%', height: '90vh', minHeight: '50vh', display: 'flex', flexDirection: 'column' }}>
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
            <thead ref={tableHeaderRef}>
              <tr>
                <th style={headerCellStyle}>Token name</th>
                <th style={headerCellStyle}>Description</th>
                <th style={headerCellStyle}>Alias / Reference</th>
                <th style={headerCellStyle}>Raw value</th>
                <th style={headerCellStyle}>CSS variable</th>
                <th style={headerCellStyle}>Specimen</th>
              </tr>
            </thead>
            {selectedCategory === 'all'
              ? groupedRows.map((group) => (
                  <TokenTypeGroupSection
                    key={group.groupId}
                    group={group}
                    isExpanded={expandedGroupSet.has(group.groupId)}
                    tableHeaderHeight={tableHeaderHeight}
                    selectedTheme={selectedTheme}
                    copiedVariable={copiedVariable}
                    expandedRowSet={expandedRowSet}
                    detailThemeByRow={detailThemeByRow}
                    onToggleGroup={toggleGroup}
                    onToggleRow={toggleRow}
                    onSetDetailTheme={handleSetDetailTheme}
                    onCopyCssVariable={handleCopyCssVariable}
                    themeOptions={designTokenManifest.themes}
                  />
                ))
              : (
                <tbody>
                  {filteredRows.map((row) => (
                    <TokenRowFragment
                      key={`${selectedTheme}-${row.path.join('.')}`}
                      row={row}
                      selectedTheme={selectedTheme}
                      copiedVariable={copiedVariable}
                      expandedRowSet={expandedRowSet}
                      detailThemeByRow={detailThemeByRow}
                      onToggleRow={toggleRow}
                      onSetDetailTheme={handleSetDetailTheme}
                      onCopyCssVariable={handleCopyCssVariable}
                      themeOptions={designTokenManifest.themes}
                    />
                  ))}
                </tbody>
              )}
          </table>
        </div>
      </div>
    </section>
  );
}

export {
  buildRows,
  buildSnapshotDiff,
  buildTokenSnapshot,
  contrastRatio,
  evaluateA11yForTheme,
  formatRawValue,
  groupRowsByType,
  resolveReferenceDetailed,
};

export default TokensTable;
