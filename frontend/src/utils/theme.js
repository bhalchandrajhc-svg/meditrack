const THEME_KEY = "theme";

export const getTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "dark" ? "dark" : "light";
};

export const applyTheme = (theme) => {
    const resolved = theme === "dark" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, resolved);
    document.documentElement.setAttribute("data-theme", resolved);
    return resolved;
};

export const initTheme = () => {
    applyTheme(getTheme());
};
