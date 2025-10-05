import { describe, expect, it } from 'vitest';

import { buildRows } from '../TokensTable';

describe('TokensTable composite rows', () => {
  const rows = buildRows();

  it('collapses typography composites into a single entry', () => {
    const typographyRow = rows.find((row) => row.displayPath === 'typography.body-1');

    expect(typographyRow).toBeDefined();
    expect(typographyRow?.values.engage).toBeTypeOf('string');
    expect(typographyRow?.values.engage).toMatch(/font-family:/);
    expect(typographyRow?.alias).toContain('fontFamily');

    const propertyRows = rows.filter((row) => row.path.join('.').startsWith('body-1.'));
    expect(propertyRows).toHaveLength(0);
  });

  it('collapses shadow composites into a single entry', () => {
    const shadowRow = rows.find((row) => row.displayPath?.startsWith('boxShadow.'));

    expect(shadowRow).toBeDefined();
    expect(shadowRow?.values.engage).toBeTypeOf('string');
    expect(shadowRow?.values.engage).toMatch(/box-shadow:/);
    expect(shadowRow?.alias).toContain('color');

    const propertyRows = rows.filter((row) => row.path.join('.').startsWith('shadows.') && row.path.length > 2);
    expect(propertyRows).toHaveLength(0);
  });
});
