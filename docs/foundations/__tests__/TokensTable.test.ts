import { describe, expect, it } from 'vitest';

import {
  buildA11yTokenOptions,
  buildRows,
  buildSnapshotDiff,
  buildTokenSnapshot,
  contrastRatio,
  evaluateA11yPair,
  evaluateA11yPairFromRows,
  evaluateA11yForTheme,
  groupRowsByType,
  resolveReferenceDetailed,
} from '../TokensTable';
import tokenSnapshot from '../token-snapshot.json';
import { getCategoryIntro } from '../token-category-intros';
import { TOKEN_A11Y_RULES } from '../token-a11y-rules';

describe('TokensTable data model', () => {
  const rows = buildRows();

  it('keeps composite rows collapsed into single entries', () => {
    const compositeRows = rows.filter((row) => row.isComposite);

    compositeRows.forEach((row) => {
      expect(row.displayPath?.startsWith(`${row.type}.`)).toBe(true);
      expect(row.compositeProperties?.length).toBeGreaterThan(0);

      const descendantRows = rows.filter(
        (candidate) => candidate.path.join('.') !== row.path.join('.') && candidate.basePath.join('.') === row.basePath.join('.')
      );
      expect(descendantRows).toHaveLength(0);
    });
  });

  it('includes semantic foundation categories from token export', () => {
    const categories = new Set(rows.map((row) => row.path[0]));

    expect(categories.has('Background')).toBe(true);
    expect(categories.has('Border')).toBe(true);
    expect(categories.has('Text')).toBe(true);
  });

  it('tracks missing references and cycles with structured status', () => {
    const theme = {
      A: { $value: '{B}' },
      B: { $value: '{A}' },
      Existing: { $value: '#ffffff' },
    };

    const missing = resolveReferenceDetailed('{Missing.Path}', theme as Record<string, unknown>);
    expect(missing.meta.status).toBe('missing-ref');

    const cycle = resolveReferenceDetailed('{A}', theme as Record<string, unknown>);
    expect(cycle.meta.status).toBe('cycle');
  });

  it('builds deterministic snapshot diff statuses', () => {
    const snapshot = buildTokenSnapshot(rows);
    const withBaseline = buildSnapshotDiff(rows, snapshot);
    expect(withBaseline.summary.added).toBe(0);

    const trimmedTokens = { ...snapshot.tokens };
    const firstKey = Object.keys(trimmedTokens)[0];
    delete trimmedTokens[firstKey];
    const withAdded = buildSnapshotDiff(rows, {
      ...snapshot,
      tokens: trimmedTokens,
    });
    expect(withAdded.summary.added).toBeGreaterThan(0);

    const withRemoved = buildSnapshotDiff(rows, {
      ...snapshot,
      tokens: {
        ...snapshot.tokens,
        'Legacy.Removed.Token': {
          cssVariable: '--legacy-removed-token',
          valuesByTheme: { engage: '#000000', legacy: '#000000' },
        },
      },
    });
    expect(withRemoved.summary.removed).toBeGreaterThan(0);
  });

  it('groups rows by token type with unknown fallback and stable counts', () => {
    const grouped = groupRowsByType(rows);
    expect(grouped.length).toBeGreaterThan(0);

    const groupedCount = grouped.reduce((acc, group) => acc + group.count, 0);
    expect(groupedCount).toBe(rows.length);

    const colorGroup = grouped.find((group) => group.groupId === 'color');
    expect(colorGroup?.count).toBeGreaterThan(0);

    const unknownGroup = groupRowsByType([
      {
        ...rows[0],
        type: undefined,
      },
    ]);
    expect(unknownGroup[0]?.groupId).toBe('unknown');
    expect(unknownGroup[0]?.groupLabel).toBe('Unknown');
  });

  it('keeps grouping stable for filtered subsets', () => {
    const subset = rows.filter((row) => row.type === 'typography' || row.type === 'boxShadow');
    const groupedSubset = groupRowsByType(subset);
    const ids = groupedSubset.map((group) => group.groupId).sort();

    expect(ids).toEqual(['boxShadow', 'typography']);
    expect(groupedSubset.every((group) => group.rows.every((row) => row.type === group.groupId))).toBe(true);
  });

  it('keeps the committed token snapshot aligned with computed rows', () => {
    const diff = buildSnapshotDiff(rows, tokenSnapshot);
    const changedPaths = diff.rows
      .filter((row) => row.diffStatus === 'changed')
      .map((row) => row.path.join('.'));
    expect(changedPaths, `Changed rows: ${changedPaths.join(', ')}`).toEqual([]);
    expect(diff.summary.added).toBe(0);
    expect(diff.summary.removed).toBe(0);
  });

  it('resolves category intros with curated and fallback content', () => {
    expect(getCategoryIntro('Background').title).toContain('Background');
    expect(getCategoryIntro('UnknownCategory').body.length).toBeGreaterThan(0);
  });

  it('evaluates a11y pairs for selected theme', () => {
    const results = evaluateA11yForTheme(rows, 'engage', TOKEN_A11Y_RULES);

    expect(results.length).toBe(TOKEN_A11Y_RULES.length);
    expect(results[0]).toHaveProperty('status');
    expect(['pass', 'fail', 'unknown']).toContain(results[0].status);
  });

  it('builds custom a11y token options from text/background semantic paths', () => {
    const options = buildA11yTokenOptions(rows, 'engage');

    expect(options.textOptions.length).toBeGreaterThan(0);
    expect(options.backgroundOptions.length).toBeGreaterThan(0);
    expect(options.textOptions.every((option) => option.path.startsWith('Text.'))).toBe(true);
    expect(options.backgroundOptions.every((option) => option.path.startsWith('Background.'))).toBe(true);
    expect(options.textOptions.every((option) => option.value.startsWith('#') || option.value.startsWith('rgb'))).toBe(true);
  });

  it('evaluates aa-normal and aa-large statuses from explicit colors', () => {
    const pass = evaluateA11yPair({ textColor: '#111111', backgroundColor: '#ffffff' });
    const fail = evaluateA11yPair({ textColor: '#7f7f7f', backgroundColor: '#ffffff' });

    expect(pass.aaNormal.passes).toBe(true);
    expect(pass.aaLarge.passes).toBe(true);
    expect(pass.summary).toBe('pass-both');
    expect(fail.aaNormal.passes).toBe(false);
    expect(fail.summary === 'pass-large-only' || fail.summary === 'fail').toBe(true);
  });

  it('evaluates custom a11y pairs from token rows and returns unknown for invalid paths', () => {
    const evaluated = evaluateA11yPairFromRows({
      textPath: 'Text.Primary.Interactive',
      backgroundPath: 'Background.Neutral.0',
      rows,
      theme: 'engage',
    });
    const unknown = evaluateA11yPairFromRows({
      textPath: 'Text.Does.Not.Exist',
      backgroundPath: 'Background.Neutral.0',
      rows,
      theme: 'engage',
    });

    expect(evaluated.ratio).not.toBeNull();
    expect(['pass-both', 'pass-large-only', 'fail']).toContain(evaluated.summary);
    expect(unknown.summary).toBe('unknown');
  });

  it('computes contrast ratio for parseable color values', () => {
    const ratio = contrastRatio('#000000', '#ffffff');
    expect(ratio).not.toBeNull();
    expect((ratio ?? 0) > 10).toBe(true);
  });
});
