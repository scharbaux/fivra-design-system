#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const ROOTS = ['src', 'docs', 'storybooks', 'visual-tests', 'scripts'];
const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.md', '.mdx', '.json', '.yml', '.yaml']);
const DIRECTORY_IGNORES = new Set(['node_modules', 'dist', 'storybook-static', '__screenshots__']);
const VARIABLE_PATTERN = /--[A-Za-z0-9-]*/g;

const violations = [];

function walk(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return;
  }

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      if (DIRECTORY_IGNORES.has(entry.name)) {
        continue;
      }
      walk(fullPath);
      continue;
    }

    const extension = path.extname(entry.name);
    if (!TEXT_EXTENSIONS.has(extension)) {
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split(/\r?\n/);

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex];
      const matches = line.match(VARIABLE_PATTERN);
      if (!matches) {
        continue;
      }

      for (const match of matches) {
        if (/[A-Z]/.test(match)) {
          violations.push(`${path.relative(ROOT_DIR, fullPath)}:${lineIndex + 1}: ${match}`);
        }
      }
    }
  }
}

for (const root of ROOTS) {
  walk(path.join(ROOT_DIR, root));
}

if (violations.length > 0) {
  console.error('Found non-kebab CSS custom properties:');
  for (const violation of violations) {
    console.error(`  - ${violation}`);
  }
  process.exit(1);
}

console.log('All CSS custom properties use kebab-case naming.');
