---
'design-system-icons': patch
---

Update Button state-layer mixing so hover/active overlays and halos use variant-aware tint sources (`surfaceColor` for primary, `borderColor` for secondary, `textColor` for tertiary), while focus ring/halo remain anchored to the primary accent. Apply variant-specific blend ordering so primary remains layer-first and secondary/tertiary are tint-first for hover/active mixes.
