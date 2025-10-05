---
"design-system-icons": patch
---

Fix Box: ensure radius tokens map to pixel values by converting `radius-*` to `calc(var(--radius*) * 1px)`; keep spacing/border-width token conversions consistent. Updates tests and Box governance docs accordingly.

