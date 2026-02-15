import type { CSSProperties } from 'react';

import type { A11yResult, ResolveStatus, SnapshotDiffStatus } from './TokensTable.model';

export const summaryStripStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginBottom: '0.6rem',
};

export const summaryPillStyle: CSSProperties = {
  fontSize: '0.78rem',
  color: '#5b6070',
  background: '#f4f5f8',
  borderRadius: '999px',
  padding: '0.22rem 0.55rem',
};

export const filterChipButtonStyle = (active: boolean): CSSProperties => ({
  border: `1px solid ${active ? 'rgba(0,0,0,0.14)' : '#3f5efb'}`,
  background: active ? '#fff' : '#eef2ff',
  color: active ? '#2f3442' : '#293683',
  borderRadius: '999px',
  padding: '0.24rem 0.62rem',
  fontSize: '0.9rem',
  fontWeight: 570,
  cursor: 'pointer',
});

export const introCardStyle: CSSProperties = {
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: '0.6rem',
  padding: '0.65rem 0.8rem',
  background: '#fafbff',
  color: '#353a47',
  marginBottom: '0.65rem',
  fontSize: '0.9rem',
};

export const snapshotStaleStyle: CSSProperties = {
  border: '1px solid #f3c869',
  background: '#fff8e8',
  color: '#6a4b00',
  borderRadius: '0.6rem',
  padding: '0.55rem 0.75rem',
  marginBottom: '0.65rem',
  fontSize: '0.85rem',
};

export const a11yPanelStyle: CSSProperties = {
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: '0.6rem',
  padding: '0.6rem 0.75rem',
  marginBottom: '0.75rem',
  background: '#fff',
};

export const a11yBadgeStyle = (status: A11yResult['status']): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '0.9rem',
  fontWeight: 570,
  borderRadius: '4px',
  padding: '0.18rem 0.45rem',
  background: status === 'pass' ? '#e9f8ef' : status === 'fail' ? '#fdeced' : '#f3f4f6',
  color: status === 'pass' ? '#0f6f3f' : status === 'fail' ? '#8e1f28' : '#5f6470',
});

export const a11ySpecimenStyle = (ratio: number | null): CSSProperties => {
  const largeTextOnly = ratio != null && ratio >= 3 && ratio < 4.5;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '7.4rem',
    height: largeTextOnly ? '2rem' : '1.8rem',
    borderRadius: '0.4rem',
    border: '1px solid rgba(0,0,0,0.14)',
    fontWeight: 700,
    fontSize: largeTextOnly ? '1.05rem' : '0.86rem',
    lineHeight: 1,
    padding: '0 0.4rem',
  };
};

export const tableViewportStyle: CSSProperties = {
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '0.75rem',
  overflow: 'hidden',
  minHeight: '90vh',
  background: '#fff',
};

export const filterLabelStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
};

export const filterLabelTextStyle: CSSProperties = {
  color: '#585663',
  fontSize: '0.8rem',
};

export const filterControlStyle: CSSProperties = {
  border: '1px solid rgba(0, 0, 0, 0.15)',
  borderRadius: '0.4rem',
  padding: '0.35rem 0.55rem',
  background: '#fff',
  fontSize: '0.9rem',
};

export const resultsPillStyle: CSSProperties = {
  marginLeft: 'auto',
  fontSize: '0.8rem',
  color: '#585663',
  background: '#f3f4f8',
  borderRadius: '999px',
  padding: '0.2rem 0.55rem',
};

export const headerCellStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 3,
  textAlign: 'left',
  padding: '0.75rem',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
  fontWeight: 600,
  background: '#f7f7f8',
  whiteSpace: 'nowrap',
};

export const groupHeaderCellStyle = (offset: number): CSSProperties => ({
  position: 'sticky',
  top: `${offset}px`,
  zIndex: 2,
  padding: 0,
  borderBottom: '1px solid rgba(0,0,0,0.08)',
  background: '#edf0f7',
  boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.04)',
});

export const groupHeaderButtonStyle: CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: 'none',
  background: 'transparent',
  color: '#2f3442',
  cursor: 'pointer',
  textAlign: 'left',
  padding: '0.52rem 0.75rem',
  font: 'inherit',
  fontWeight: 600,
};

export const groupHeaderLabelWrapStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
};

export const groupChevronStyle = (isExpanded: boolean): CSSProperties => ({
  display: 'inline-flex',
  width: '0.9rem',
  justifyContent: 'center',
  transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
  transition: 'transform 140ms ease',
  color: '#4d5464',
});

export const groupHeaderMetricsStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
};

export const groupMetricBadgeStyle: CSSProperties = {
  borderRadius: '999px',
  background: '#dfe4f3',
  color: '#353d4d',
  fontSize: '0.72rem',
  padding: '0.1rem 0.45rem',
  fontWeight: 570,
};

export const groupWarningBadgeStyle: CSSProperties = {
  borderRadius: '999px',
  background: '#fff3db',
  color: '#8c5a1b',
  fontSize: '0.72rem',
  padding: '0.1rem 0.45rem',
  fontWeight: 570,
};

export const groupDiffAddedBadgeStyle: CSSProperties = {
  borderRadius: '999px',
  background: '#e8f7ef',
  color: '#0f6f3f',
  fontSize: '0.72rem',
  padding: '0.1rem 0.45rem',
  fontWeight: 570,
};

export const groupDiffChangedBadgeStyle: CSSProperties = {
  borderRadius: '999px',
  background: '#f2f0ff',
  color: '#4e40a0',
  fontSize: '0.72rem',
  padding: '0.1rem 0.45rem',
  fontWeight: 570,
};

export const groupDiffRemovedBadgeStyle: CSSProperties = {
  borderRadius: '999px',
  background: '#fdeced',
  color: '#8e1f28',
  fontSize: '0.72rem',
  padding: '0.1rem 0.45rem',
  fontWeight: 570,
};

export const cellStyle: CSSProperties = {
  padding: '0.75rem',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
  verticalAlign: 'top',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
};

export const removedRowStyle: CSSProperties = {
  opacity: 0.8,
  background: '#fff9f9',
};

export const codeWrapStyle: CSSProperties = {
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
};

export const copyButtonStyle: CSSProperties = {
  display: 'inline-block',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: '0.45rem',
  background: '#ffffff',
  color: '#20232a',
  padding: '0.35rem 0.45rem',
  cursor: 'pointer',
  font: 'inherit',
  textAlign: 'left',
  position: 'relative',
  width: '100%',
};

export const copyValueStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  paddingRight: '2rem',
};

export const copyButtonInteractiveStyle = `
  .tokens-group-toggle:hover,
  .tokens-group-toggle:focus-visible {
    background: rgba(255,255,255,0.56);
    outline: none;
  }

  .tokens-copy-button:hover,
  .tokens-copy-button:focus-visible {
    background: #f7f7f8!important;
    border-color: rgba(0,0,0,0.18);
  }

  .tokens-copy-button .tokens-copy-glyph {
    opacity: 0;
    transform: translateY(-50%) scale(0.96);
    transition: opacity 140ms ease, transform 140ms ease;
  }

  .tokens-copy-button:hover .tokens-copy-glyph,
  .tokens-copy-button:focus-visible .tokens-copy-glyph {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }

  .tokens-copy-button.is-copied::after {
    content: "Copied";
    position: absolute;
    top: -1.42rem;
    right: 0.45rem;
    background: #2e3440;
    color: #ffffff;
    border-radius: 0.35rem;
    padding: 0.15rem 0.35rem;
    font-size: 0.68rem;
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
    z-index: 2;
  }
`;

export const copyGlyphStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.35rem',
  height: '1.35rem',
  borderRadius: '0.25rem',
  border: '1px solid rgba(0,0,0,0.16)',
  background: '#fff',
  color: '#5f6470',
  flexShrink: 0,
  position: 'absolute',
  top: '50%',
  right: '0.45rem',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
};

export const contrastSpecimenCardStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  minWidth: '9.25rem',
  height: '2.8rem',
  borderRadius: '0.45rem',
  padding: '0 0.65rem',
  boxSizing: 'border-box',
};

export const contrastLeftValueStyle: CSSProperties = {
  fontWeight: 700,
  color: '#ffffff',
  fontSize: '1rem',
  textShadow: '0 1px 1px rgba(0,0,0,0.2)',
};

export const contrastRightValueStyle: CSSProperties = {
  fontWeight: 700,
  color: '#000000',
  fontSize: '1rem',
};

export const toggleButtonStyle: CSSProperties = {
  border: '1px solid rgba(0,0,0,0.14)',
  borderRadius: '0.3rem',
  background: '#fff',
  color: '#303645',
  cursor: 'pointer',
  fontSize: '0.72rem',
  lineHeight: 1,
  padding: '0.2rem 0.32rem',
};

export const diagnosticBadgeStyle = (status: ResolveStatus): CSSProperties => ({
  borderRadius: '999px',
  fontSize: '0.68rem',
  padding: '0.08rem 0.45rem',
  background: status === 'missing-ref' ? '#fff4e5' : status === 'cycle' ? '#fceef3' : '#fdeceb',
  color: status === 'missing-ref' ? '#8c5a1b' : status === 'cycle' ? '#8a2a4b' : '#8e1f28',
});

export const diffBadgeStyle = (status: SnapshotDiffStatus): CSSProperties => ({
  borderRadius: '4px',
  fontSize: '0.8rem',
  fontWeight: 570,
  lineHeight: '1rem',
  padding: '0.16rem 0.45rem',
  background:
    status === 'added'
      ? '#e6f4ea'
      : status === 'changed'
        ? '#ece8ff'
        : status === 'removed'
          ? '#fdebec'
          : '#f0f2f7',
  color:
    status === 'added'
      ? '#0f6f3f'
      : status === 'changed'
        ? '#5245b8'
        : status === 'removed'
          ? '#8e1f28'
          : '#495063',
});

export const expandedCellStyle: CSSProperties = {
  padding: '0.6rem 0.75rem 0.8rem',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
  background: '#f9faff',
};

export const expandedPanelStyle: CSSProperties = {
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: '0.55rem',
  padding: '0.55rem 0.65rem',
  background: '#ffffff',
};

export const themeTabStyle = (active: boolean): CSSProperties => ({
  border: `1px solid ${active ? '#3f5efb' : 'rgba(0,0,0,0.16)'}`,
  background: active ? '#eef2ff' : '#fff',
  color: active ? '#293683' : '#313848',
  borderRadius: '999px',
  padding: '0.2rem 0.6rem',
  fontSize: '0.74rem',
  cursor: 'pointer',
});

export const miniHeaderStyle: CSSProperties = {
  textAlign: 'left',
  fontSize: '0.72rem',
  letterSpacing: '0.01em',
  color: '#596076',
  textTransform: 'uppercase',
  padding: '0.34rem 0.45rem',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
};

export const miniCellStyle: CSSProperties = {
  padding: '0.38rem 0.45rem',
  borderBottom: '1px solid rgba(0,0,0,0.06)',
  fontSize: '0.84rem',
};
