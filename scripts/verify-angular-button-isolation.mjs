#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const filesToCheck = [
  'src/angular/button/fivra-button.component.ts',
  'src/angular/button/button.styles.ts',
  'src/angular/button/color-overrides.ts',
  'src/angular/button/state-layer-mix.ts',
  'src/angular/button/index.ts',
  'src/angular/button/fivra-button.module.ts',
  'src/angular/button/fivra-button.directives.ts',
  'src/angular/button/__tests__/fivra-button.component.test.ts',
  'storybooks/angular/src/stories/Button.stories.ts',
];

const forbiddenImportPatterns = [
  /^@shared\/button(?:\/|$)/u,
  /^@components\/Button(?:\/|$)/u,
  /(?:^|\/)src\/shared\/button(?:\/|$)/u,
  /(?:^|\/)src\/components\/Button(?:\/|$)/u,
  /(?:^|\.\.)\/.*shared\/button(?:\/|$)/u,
  /(?:^|\.\.)\/.*components\/Button(?:\/|$)/u,
];

const importSpecPattern = /\bfrom\s+['"]([^'"]+)['"]/gu;
const dynamicImportPattern = /\bimport\(\s*['"]([^'"]+)['"]\s*\)/gu;

const violations = [];

for (const relativeFile of filesToCheck) {
  const absoluteFile = path.join(repoRoot, relativeFile);
  const source = readFileSync(absoluteFile, 'utf8');

  const checkMatches = (pattern) => {
    const matches = [...source.matchAll(pattern)];
    for (const match of matches) {
      const specifier = match[1];
      const isForbidden = forbiddenImportPatterns.some((forbidden) =>
        forbidden.test(specifier),
      );

      if (isForbidden) {
        violations.push({ file: relativeFile, specifier });
      }
    }
  };

  checkMatches(importSpecPattern);
  checkMatches(dynamicImportPattern);
}

if (violations.length > 0) {
  console.error(
    [
      'Angular Button isolation check failed. Found forbidden imports:',
      ...violations.map(
        ({ file, specifier }) => `- ${file}: ${specifier}`,
      ),
      '',
      'Use Angular-local modules under src/angular/button for Angular Button and Storybook Angular Button stories.',
    ].join('\n'),
  );
  process.exit(1);
}

console.log('Angular Button isolation check passed.');
