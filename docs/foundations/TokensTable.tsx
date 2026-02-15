import { useEffect, useMemo, useRef, useState } from 'react';

import tokenSnapshot from './token-snapshot.json';
import { getCategoryIntro } from './token-category-intros';
import {
  BASE_ROWS,
  buildA11yTokenOptions,
  buildRows,
  buildSnapshotDiff,
  buildTokenSnapshot,
  compareByTypeThenPath,
  contrastRatio,
  designTokenManifest,
  evaluateA11yPair,
  evaluateA11yPairFromRows,
  evaluateA11yForTheme,
  formatRawValue,
  groupRowsByType,
  isIssueRow,
  resolveReferenceDetailed,
  type A11yTokenOption,
  type SnapshotDiffStatus,
  type ThemeSlug,
  type TokenSnapshot,
} from './TokensTable.model';
import { TokenRowFragment, TokenTypeGroupSection } from './TokensTableRows';
import {
  a11yBadgeStyle,
  a11yBuilderCardStyle,
  a11yBuilderChipStyle,
  a11yBuilderChipsStyle,
  a11yBuilderControlLabelStyle,
  a11yBuilderGridStyle,
  a11yBuilderHintStyle,
  a11yBuilderInputStyle,
  a11yBuilderLabelStyle,
  a11yBuilderPreviewStyle,
  a11yBuilderPreviewTextStyle,
  a11yBuilderRatioStyle,
  a11yBuilderSelectStyle,
  a11yBuilderSummaryStyle,
  a11yBuilderSwapButtonStyle,
  a11yBuilderTitleStyle,
  a11ySizeToggleButtonStyle,
  a11ySizeToggleWrapStyle,
  a11yActionButtonStyle,
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
const A11Y_QUERY_TEXT = 'a11yText';
const A11Y_QUERY_BACKGROUND = 'a11yBg';
const A11Y_QUERY_SIZE = 'a11ySize';

type A11yTextSizeMode = 'normal' | 'large';

function readInitialA11yQueryState(): { textPath?: string; backgroundPath?: string; sizeMode: A11yTextSizeMode } {
  try {
    const params = new URLSearchParams(window.location.search);
    const sizeParam = params.get(A11Y_QUERY_SIZE);
    return {
      textPath: params.get(A11Y_QUERY_TEXT) ?? undefined,
      backgroundPath: params.get(A11Y_QUERY_BACKGROUND) ?? undefined,
      sizeMode: sizeParam === 'large' ? 'large' : 'normal',
    };
  } catch {
    return { sizeMode: 'normal' };
  }
}

function getA11yBuilderSummaryCopy(summary: 'pass-both' | 'pass-large-only' | 'fail' | 'unknown'): string {
  if (summary === 'pass-both') {
    return 'Passes both AA normal and AA large text.';
  }

  if (summary === 'pass-large-only') {
    return 'Passes AA for large text only.';
  }

  if (summary === 'fail') {
    return 'Fails AA thresholds. Try darker text or lighter background tokens.';
  }

  return 'Cannot evaluate this pair yet. Select resolvable text and background tokens.';
}

function getA11yTokenLabel(path: string, options: A11yTokenOption[]): string {
  return options.find((option) => option.path === path)?.label ?? path;
}

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
  const [a11yBuilderTextPath, setA11yBuilderTextPath] = useState<string>(() => readInitialA11yQueryState().textPath ?? '');
  const [a11yBuilderBackgroundPath, setA11yBuilderBackgroundPath] = useState<string>(
    () => readInitialA11yQueryState().backgroundPath ?? ''
  );
  const [a11yBuilderSizeMode, setA11yBuilderSizeMode] = useState<A11yTextSizeMode>(
    () => readInitialA11yQueryState().sizeMode
  );
  const [a11yTextSearch, setA11yTextSearch] = useState<string>('');
  const [a11yBackgroundSearch, setA11yBackgroundSearch] = useState<string>('');

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
  const a11yTokenOptions = useMemo(() => buildA11yTokenOptions(diff.rows, selectedTheme), [diff.rows, selectedTheme]);
  const filteredTextTokenOptions = useMemo(() => {
    const query = a11yTextSearch.trim().toLowerCase();
    if (!query) {
      return a11yTokenOptions.textOptions;
    }

    return a11yTokenOptions.textOptions.filter((option) =>
      `${option.path} ${option.label}`.toLowerCase().includes(query)
    );
  }, [a11yTokenOptions.textOptions, a11yTextSearch]);
  const filteredBackgroundTokenOptions = useMemo(() => {
    const query = a11yBackgroundSearch.trim().toLowerCase();
    if (!query) {
      return a11yTokenOptions.backgroundOptions;
    }

    return a11yTokenOptions.backgroundOptions.filter((option) =>
      `${option.path} ${option.label}`.toLowerCase().includes(query)
    );
  }, [a11yBackgroundSearch, a11yTokenOptions.backgroundOptions]);
  const a11yBuilderEvaluation = useMemo(
    () =>
      evaluateA11yPairFromRows({
        textPath: a11yBuilderTextPath || undefined,
        backgroundPath: a11yBuilderBackgroundPath || undefined,
        rows: diff.rows,
        theme: selectedTheme,
      }),
    [a11yBuilderBackgroundPath, a11yBuilderTextPath, diff.rows, selectedTheme]
  );

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
    const hasText = a11yTokenOptions.textOptions.some((option) => option.path === a11yBuilderTextPath);
    const hasBackground = a11yTokenOptions.backgroundOptions.some((option) => option.path === a11yBuilderBackgroundPath);

    if (!hasText) {
      setA11yBuilderTextPath(a11yTokenOptions.textOptions[0]?.path ?? '');
    }

    if (!hasBackground) {
      setA11yBuilderBackgroundPath(a11yTokenOptions.backgroundOptions[0]?.path ?? '');
    }
  }, [
    a11yBuilderBackgroundPath,
    a11yBuilderTextPath,
    a11yTokenOptions.backgroundOptions,
    a11yTokenOptions.textOptions,
  ]);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (a11yBuilderTextPath) {
        url.searchParams.set(A11Y_QUERY_TEXT, a11yBuilderTextPath);
      } else {
        url.searchParams.delete(A11Y_QUERY_TEXT);
      }

      if (a11yBuilderBackgroundPath) {
        url.searchParams.set(A11Y_QUERY_BACKGROUND, a11yBuilderBackgroundPath);
      } else {
        url.searchParams.delete(A11Y_QUERY_BACKGROUND);
      }

      url.searchParams.set(A11Y_QUERY_SIZE, a11yBuilderSizeMode);
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // Ignore URL update issues in non-browser contexts.
    }
  }, [a11yBuilderBackgroundPath, a11yBuilderSizeMode, a11yBuilderTextPath]);

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

  const handleSwapA11yPair = () => {
    setA11yBuilderTextPath(a11yBuilderBackgroundPath);
    setA11yBuilderBackgroundPath(a11yBuilderTextPath);
  };

  const handleLoadRuleIntoBuilder = (textPath: string, backgroundPath: string) => {
    setA11yBuilderTextPath(textPath);
    setA11yBuilderBackgroundPath(backgroundPath);
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
        <div style={{ marginTop: '0.5rem' }}>
          <div style={a11yBuilderCardStyle}>
            <div style={a11yBuilderTitleStyle}>
              <strong>Custom pair builder</strong>
              <span style={a11yBuilderHintStyle}>Pick semantic text/background tokens and validate instantly.</span>
            </div>

            <div style={a11yBuilderGridStyle}>
              <label style={a11yBuilderLabelStyle}>
                <span style={a11yBuilderControlLabelStyle}>Text token search</span>
                <input
                  type="search"
                  placeholder="Search text tokens..."
                  value={a11yTextSearch}
                  onChange={(event) => setA11yTextSearch(event.target.value)}
                  style={a11yBuilderInputStyle}
                />
              </label>
              <label style={a11yBuilderLabelStyle}>
                <span style={a11yBuilderControlLabelStyle}>Text token</span>
                <select
                  value={a11yBuilderTextPath}
                  onChange={(event) => setA11yBuilderTextPath(event.target.value)}
                  style={a11yBuilderSelectStyle}
                >
                  {filteredTextTokenOptions.map((option) => (
                    <option key={option.path} value={option.path}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={a11yBuilderLabelStyle}>
                <span style={a11yBuilderControlLabelStyle}>Background token search</span>
                <input
                  type="search"
                  placeholder="Search background tokens..."
                  value={a11yBackgroundSearch}
                  onChange={(event) => setA11yBackgroundSearch(event.target.value)}
                  style={a11yBuilderInputStyle}
                />
              </label>
              <label style={a11yBuilderLabelStyle}>
                <span style={a11yBuilderControlLabelStyle}>Background token</span>
                <select
                  value={a11yBuilderBackgroundPath}
                  onChange={(event) => setA11yBuilderBackgroundPath(event.target.value)}
                  style={a11yBuilderSelectStyle}
                >
                  {filteredBackgroundTokenOptions.map((option) => (
                    <option key={option.path} value={option.path}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <div style={a11yBuilderLabelStyle}>
                <span style={a11yBuilderControlLabelStyle}>Text size mode</span>
                <div style={a11ySizeToggleWrapStyle}>
                  <button
                    type="button"
                    style={a11ySizeToggleButtonStyle(a11yBuilderSizeMode === 'normal')}
                    onClick={() => setA11yBuilderSizeMode('normal')}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    style={a11ySizeToggleButtonStyle(a11yBuilderSizeMode === 'large')}
                    onClick={() => setA11yBuilderSizeMode('large')}
                  >
                    Large
                  </button>
                </div>
              </div>
              <button type="button" style={a11yBuilderSwapButtonStyle} onClick={handleSwapA11yPair}>
                Swap pair
              </button>
            </div>

            <div style={a11yBuilderPreviewStyle}>
              {a11yBuilderEvaluation.textColor && a11yBuilderEvaluation.backgroundColor ? (
                <>
                  <span
                    style={a11yBuilderPreviewTextStyle(
                      a11yBuilderEvaluation.textColor,
                      a11yBuilderEvaluation.backgroundColor,
                      a11yBuilderSizeMode === 'large'
                    )}
                  >
                    {a11yBuilderSizeMode === 'large' ? 'Large text sample' : 'Normal text sample'}
                  </span>
                  <span style={a11yBuilderRatioStyle}>
                    Contrast: {a11yBuilderEvaluation.ratio != null ? `${a11yBuilderEvaluation.ratio.toFixed(2)}:1` : '—'}
                  </span>
                  <div style={a11yBuilderChipsStyle}>
                    <span style={a11yBuilderChipStyle(a11yBuilderEvaluation.aaNormal.passes)}>
                      AA Normal (4.5): {a11yBuilderEvaluation.aaNormal.passes == null ? 'Unknown' : a11yBuilderEvaluation.aaNormal.passes ? 'Pass' : 'Fail'}
                    </span>
                    <span style={a11yBuilderChipStyle(a11yBuilderEvaluation.aaLarge.passes)}>
                      AA Large (3.0): {a11yBuilderEvaluation.aaLarge.passes == null ? 'Unknown' : a11yBuilderEvaluation.aaLarge.passes ? 'Pass' : 'Fail'}
                    </span>
                  </div>
                  <span style={a11yBuilderSummaryStyle(a11yBuilderEvaluation.summary)}>
                    {getA11yBuilderSummaryCopy(a11yBuilderEvaluation.summary)}
                  </span>
                  <span style={a11yBuilderHintStyle}>
                    {getA11yTokenLabel(a11yBuilderTextPath, a11yTokenOptions.textOptions)} on{' '}
                    {getA11yTokenLabel(a11yBuilderBackgroundPath, a11yTokenOptions.backgroundOptions)}
                  </span>
                </>
              ) : (
                <span style={a11yBuilderHintStyle}>
                  Cannot evaluate this pair yet. Select resolvable text and background tokens.
                </span>
              )}
            </div>
          </div>

          <p style={{ margin: '0 0 0.45rem', color: '#5f6470', fontSize: '0.84rem' }}>
            Common usages below are curated checks. Use <code>Load</code> to send any pair into the builder.
          </p>

          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={miniHeaderStyle}>Pair</th>
                <th style={miniHeaderStyle}>Tokens</th>
                <th style={miniHeaderStyle}>Specimen</th>
                <th style={miniHeaderStyle}>Ratio</th>
                <th style={miniHeaderStyle}>Status</th>
                <th style={miniHeaderStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {a11yResults.map((result) => (
                <tr key={result.id}>
                  <td style={miniCellStyle}>{result.label}</td>
                  <td style={miniCellStyle}>
                    <code style={{ fontSize: '0.75rem' }}>{result.textTokenPath}</code>
                    <br />
                    <code style={{ fontSize: '0.75rem' }}>{result.backgroundTokenPath}</code>
                  </td>
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
                  <td style={miniCellStyle}>
                    <button
                      type="button"
                      style={a11yActionButtonStyle}
                      onClick={() => handleLoadRuleIntoBuilder(result.textTokenPath, result.backgroundTokenPath)}
                    >
                      Load
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
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
  buildA11yTokenOptions,
  buildRows,
  buildSnapshotDiff,
  buildTokenSnapshot,
  contrastRatio,
  evaluateA11yPair,
  evaluateA11yPairFromRows,
  evaluateA11yForTheme,
  formatRawValue,
  groupRowsByType,
  resolveReferenceDetailed,
};

export default TokensTable;
