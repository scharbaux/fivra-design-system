import type { ReactNode } from 'react';

import { Icon } from '@components';
import { icons as generatedIcons } from '@shared/icons/icons.generated';
import {
  contrastRatio,
  formatContrastValue,
  isColor,
  normalizeTypographyFamily,
  normalizeTypographyValue,
  normalizeTypographyWeight,
  parseNumeric,
  type ThemeSlug,
  type TokenRow,
} from './TokensTable.model';
import {
  contrastLeftValueStyle,
  contrastRightValueStyle,
  contrastSpecimenCardStyle,
} from './TokensTable.styles';

const numberLikeTypes = new Set(['spacing', 'borderWidth', 'borderRadius', 'dimension', 'number']);
const specimenIconName = Object.keys(generatedIcons).includes('chevron-right')
  ? 'chevron-right'
  : Object.keys(generatedIcons)[0] ?? '';

export function Specimen({ row, theme }: { row: TokenRow; theme: ThemeSlug }): ReactNode {
  if (row.diffStatus === 'removed') {
    return <span style={{ color: '#7d8190', fontSize: '0.8rem' }}>removed</span>;
  }

  const value = row.resolvedValueByTheme[theme];
  const category = row.path[0]?.toLowerCase();

  if (isColor(value)) {
    if (category === 'background' || category === 'border' || category === 'text') {
      const whiteRatio = contrastRatio('#ffffff', value);
      const blackRatio = contrastRatio('#000000', value);

      return (
        <span
          style={{
            ...contrastSpecimenCardStyle,
            background: value,
            border: category === 'border' ? `3px solid ${value}` : '1px solid rgba(0,0,0,0.14)',
          }}
          aria-label={`Contrast sample. White: ${formatContrastValue(whiteRatio)}. Black: ${formatContrastValue(blackRatio)}.`}
        >
          <span style={contrastLeftValueStyle}>{formatContrastValue(whiteRatio)}</span>
          <span style={contrastRightValueStyle}>{formatContrastValue(blackRatio)}</span>
        </span>
      );
    }

    const sphereBase = {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 1px 2px rgba(0,0,0,0.12)',
    };

    const sphereStyle =
      category === 'border'
        ? {
            ...sphereBase,
            background: '#ffffff',
            border: `4px solid ${value}`,
          }
        : {
            ...sphereBase,
            background: value,
            border: '1px solid rgba(0,0,0,0.12)',
          };

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.75rem',
          height: '2.75rem',
          borderRadius: '999px',
          backgroundImage:
            'linear-gradient(45deg, #e4e6eb 25%, transparent 25%), linear-gradient(-45deg, #e4e6eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e4e6eb 75%), linear-gradient(-45deg, transparent 75%, #e4e6eb 75%)',
          backgroundSize: '10px 10px',
          backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
        }}
        aria-label={`Color swatch ${value}`}
      >
        <span style={sphereStyle} />
      </span>
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

      if (category === 'iconsizes' && specimenIconName) {
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
            aria-label={`Icon size sample ${dimensionLabel}`}
          >
            <Icon name={specimenIconName} size={`${numeric}px`} color="#4c57ea" />
          </span>
        );
      }

      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
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
              height: `${Math.max(numeric, 1)}px`,
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
          background: `linear-gradient(135deg, rgba(76,87,234,${opacity}) 0%, rgba(76,87,234,${Math.max(opacity - 0.2, 0)}) 100%)`,
        }}
        aria-label={`Opacity sample ${value}`}
      />
    );
  }

  if (row.type === 'typography') {
    const composite = row.compositeValues?.[theme];
    if (composite) {
      const style = {
        fontFamily: normalizeTypographyFamily(composite.fontFamily),
        fontWeight: normalizeTypographyWeight(composite.fontWeight),
        fontSize: normalizeTypographyValue(composite.fontSize),
        lineHeight: normalizeTypographyValue(composite.lineHeight),
        letterSpacing: normalizeTypographyValue(composite.letterSpacing),
        display: 'inline-flex',
        alignItems: 'center',
      } as const;

      return (
        <span style={style} aria-label={`Typography sample for ${row.basePath.join('.')}`}>
          Aa
        </span>
      );
    }
  }

  if (row.type === 'boxShadow') {
    const composite = row.compositeValues?.[theme];
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
          aria-label={`Shadow sample for ${row.basePath.join('.')}`}
        />
      );
    }
  }

  return <span aria-hidden="true">—</span>;
}
