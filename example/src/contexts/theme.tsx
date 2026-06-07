import * as React from "react";

type Theme = "light" | "dark";

type ThemeMode = Theme | "system";

type ThemeContextType = {
    theme: Theme;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
};

const ThemeContext = React.createContext<ThemeContextType | null>(null);

type ThemeContextProviderProps = {
    defaultMode?: ThemeMode;
    children?: React.ReactNode;
};

const ThemeContextProvider = (
    props: ThemeContextProviderProps,
): React.JSX.Element => {
    const [theme, setTheme] = React.useState<Theme>("light");
    const [mode, setMode] = React.useState<ThemeMode>(
        props.defaultMode ?? "system",
    );

    React.useEffect((): void => {
        if (mode === "system") {
            setTheme(
                window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light",
            );
        } else {
            setTheme(mode);
        }
    }, [
        mode,
    ]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                mode,
                setMode,
            }}
        >
            {props.children}
        </ThemeContext.Provider>
    );
};

const useThemeContext = (): ThemeContextType => {
    const context = React.useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useThemeContext must be used within a ThemeContextProvider",
        );
    }

    return context;
};

export type { Theme, ThemeContextProviderProps, ThemeContextType, ThemeMode };
export { ThemeContextProvider, useThemeContext };
