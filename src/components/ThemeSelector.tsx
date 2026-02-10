import { useEffect, useMemo, useState } from "react";

type ThemeId = "cool-art" | "dark-gallery" | "gallery-white" | "pink-purple";

const THEMES: { id: ThemeId; label: string; hint: string }[] = [
  { id: "cool-art", label: "Cool Art", hint: "Cobalt + mint, glassy" },
  { id: "pink-purple", label: "Pink–Purple Art", hint: "Soft, expressive" },
  //{ id: "dark-gallery", label: "Dark Gallery", hint: "Moody, high contrast" },
  { id: "gallery-white", label: "Gallery White", hint: "Minimal, bright" },
  
];

function applyTheme(theme: ThemeId) {
  document.body.dataset.theme = theme;
  localStorage.setItem("wlb-theme", theme);
}

function readSavedTheme(): ThemeId | null {
  const v = localStorage.getItem("wlb-theme");
  if (
    v === "cool-art" ||
    v === "dark-gallery" ||
    v === "gallery-white" ||
    v === "pink-purple"
  ) {
    return v;
  }
  return null; // old "cyber-cool" users fall back automatically
}

export default function ThemeSelector() {
  const defaultTheme = useMemo<ThemeId>(() => "cool-art", []);
  const [theme, setTheme] = useState<ThemeId>(defaultTheme);

  useEffect(() => {
    const saved = readSavedTheme();
    const initial = saved ?? defaultTheme;
    setTheme(initial);
    applyTheme(initial);
  }, [defaultTheme]);

  return (
    <div className="themePicker" title="Theme">
      <select
        className="themeSelect"
        value={theme}
        onChange={(e) => {
          const next = e.target.value as ThemeId;
          setTheme(next);
          applyTheme(next);
        }}
        aria-label="Theme"
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>

      <div className="themeHint">
        {THEMES.find((t) => t.id === theme)?.hint}
      </div>
    </div>
  );
}
