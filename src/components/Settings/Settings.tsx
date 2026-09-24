import React, { useEffect, useState } from "react";

const THEME_KEY = "sn-theme";
type ThemeType = "light" | "dark";

const readTheme = (): ThemeType => {
  try {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export const applyStoredTheme = () => {
  document.documentElement.dataset.theme = readTheme();
};

const Settings: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // localStorage може бути недоступний (приватний режим)
    }
  }, [theme]);

  return (
    <div className="page">
      <h2>Settings</h2>
      <label>
        <input type="checkbox" checked={theme === "dark"} onChange={(e) => setTheme(e.target.checked ? "dark" : "light")} />{" "}
        Темна тема
      </label>
    </div>
  );
};

export default Settings;
