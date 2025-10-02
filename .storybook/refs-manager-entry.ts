const getEnv = (key: string, fallback?: string) => {
  if (typeof process === "undefined") {
    return fallback;
  }

  const value = process.env?.[key];
  return value && value.length > 0 ? value : fallback;
};

const refMode = getEnv("STORYBOOK_REF_MODE", "dev");
const isStatic = refMode === "static";

const angularDevUrl = getEnv("STORYBOOK_ANGULAR_URL", "http://localhost:6007");
const vueDevUrl = getEnv("STORYBOOK_VUE_URL", "http://localhost:6008");
const angularStaticUrl = getEnv("STORYBOOK_ANGULAR_STATIC_URL", "./angular");
const vueStaticUrl = getEnv("STORYBOOK_VUE_STATIC_URL", "./vue");

const includeAngular = getEnv("STORYBOOK_COMPOSE_ANGULAR", "true") !== "false";
const includeVue = getEnv("STORYBOOK_COMPOSE_VUE", "true") !== "false";

type ComposedRef = {
  title: string;
  url: string;
  expanded: boolean;
};

const buildRefs = (): Record<string, ComposedRef> => {
  const nextRefs: Record<string, ComposedRef> = {};

  if (includeAngular) {
    nextRefs.angular = {
      title: "Components/Button/Angular",
      url: isStatic ? angularStaticUrl! : angularDevUrl!,
      expanded: true,
    };
  }

  if (includeVue) {
    nextRefs.vue = {
      title: "Components/Button/Vue",
      url: isStatic ? vueStaticUrl! : vueDevUrl!,
      expanded: true,
    };
  }

  return nextRefs;
};

const refs = buildRefs();

declare global {
  interface Window {
    STORYBOOK_REFS?: Record<string, ComposedRef>;
  }
}

if (typeof window !== "undefined" && Object.keys(refs).length > 0) {
  window.STORYBOOK_REFS = {
    ...(window.STORYBOOK_REFS || {}),
    ...refs,
  };
}

export {};
