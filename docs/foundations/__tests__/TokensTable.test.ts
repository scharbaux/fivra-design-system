import { describe, expect, it } from 'vitest';

import { buildRows } from '../TokensTable';

describe('TokensTable composite rows', () => {
  const rows = buildRows();

  it('keeps composite rows collapsed when typography or shadow composites are present', () => {
    const compositeRows = rows.filter((row) => row.type === 'typography' || row.type === 'boxShadow');

    compositeRows.forEach((row) => {
      expect(row.displayPath?.startsWith(`${row.type}.`)).toBe(true);
      expect(row.values.engage).toBeTypeOf('string');
      expect(row.alias).toBeTypeOf('string');

      const descendantRows = rows.filter(
        (candidate) => candidate.path.join('.') !== row.path.join('.') && candidate.basePath.join('.') === row.basePath.join('.')
      );
      expect(descendantRows).toHaveLength(0);
    });
  });

  it('includes semantic foundation categories from the latest token export', () => {
    const categories = new Set(rows.map((row) => row.path[0]));

    expect(categories.has('Background')).toBe(true);
    expect(categories.has('Border')).toBe(true);
    expect(categories.has('Text')).toBe(true);
  });
});
