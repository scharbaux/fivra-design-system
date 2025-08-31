import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Icon from "../components/Icon";

// Discover icons and categories from the filesystem via Vite's glob import.
const outlineFiles = import.meta.glob("../icons/outline/**/*.svg", { eager: true });
const solidFiles = import.meta.glob("../icons/solid/**/*.svg", { eager: true });

type Variant = "outline" | "solid";
type IconRecord = { name: string; category: string; variant: Variant };

function parseFilesToMeta(files: Record<string, unknown>, variant: Variant): IconRecord[] {
  const items: IconRecord[] = [];
  for (const p of Object.keys(files)) {
    const key = p.replace(/\\/g, "/");
    // Expect patterns like ../icons/outline/<category>/<name>.svg
    const m = key.match(/icons\/(outline|solid)\/([^/]+)\/([^/]+)\.svg$/);
    if (!m) continue;
    const category = m[2];
    const name = m[3];
    items.push({ name, category, variant });
  }
  return items;
}

const OUTLINE_META = parseFilesToMeta(outlineFiles as any, "outline");
const SOLID_META = parseFilesToMeta(solidFiles as any, "solid");
const ALL_META: IconRecord[] = [...OUTLINE_META, ...SOLID_META];

const ALL_CATEGORIES = Array.from(new Set(ALL_META.map((i) => i.category))).sort();

const meta: Meta = {
  title: "Gallery/Icons",
  argTypes: {
    variant: {
      control: { type: "inline-radio" },
      options: ["outline", "solid"],
    },
    category: {
      control: { type: "select" },
      options: ["all", ...ALL_CATEGORIES],
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Browse all icons with filters. Click any tile to copy the icon name for use in the Icon component's `name` prop.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<{ variant: Variant; category: string }>;

function useFilteredIcons(variant: Variant, category: string) {
  return useMemo(() => {
    const from = variant === "outline" ? OUTLINE_META : SOLID_META;
    let list = from;
    if (category && category !== "all") list = list.filter((i) => i.category === category);
    // Unique + stable sort by name
    const set = new Map<string, IconRecord>();
    for (const it of list) set.set(it.name, it);
    return Array.from(set.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [variant, category]);
}

function copyText(txt: string) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(txt);
  }
  // Fallback for non-secure context
  const ta = document.createElement("textarea");
  ta.value = txt;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(ta);
  }
  return Promise.resolve();
}

const Gallery: React.FC<{ variant: Variant; category: string }> = ({ variant, category }) => {
  const icons = useFilteredIcons(variant, category);
  const [copied, setCopied] = useState<string | null>(null);

  const onCopy = async (name: string) => {
    await copyText(name);
    setCopied(name);
    window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1000);
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
        <span style={{ color: "#6b7280" }}>{icons.length} icons</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 16,
          alignItems: "start",
        }}
      >
        {icons.map((it) => (
          <button
            key={`${variant}:${it.name}`}
            onClick={() => onCopy(it.name)}
            title={`Click to copy: ${it.name}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: copied === it.name ? "#f0fdf4" : "#fff",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center", minHeight: 28 }}>
              <Icon name={it.name} variant={variant} size={28} color="#111827" />
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", textAlign: "center", wordBreak: "break-all" }}>
              {it.name}
              {copied === it.name ? <span style={{ color: "#16a34a", marginLeft: 8 }}>(copied)</span> : null}
            </div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>{it.category}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const Preview: Story = {
  name: "Icons Gallery",
  args: {
    variant: "outline",
    category: "all",
  },
  render: (args) => <Gallery {...args} />,
};

