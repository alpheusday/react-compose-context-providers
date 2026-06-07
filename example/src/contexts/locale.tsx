import * as React from "react";

type Locale = "en" | "ja" | "zh-HK";

type LocaleContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
};

const LocaleContext = React.createContext<LocaleContextType | null>(null);

type LocaleContextProviderProps = {
    defaultLocale?: Locale;
    children?: React.ReactNode;
};

const LocaleContextProvider = (
    props: LocaleContextProviderProps,
): React.JSX.Element => {
    const [locale, setLocale] = React.useState<Locale>(
        props.defaultLocale ?? "en",
    );

    return (
        <LocaleContext.Provider
            value={{
                locale,
                setLocale,
            }}
        >
            {props.children}
        </LocaleContext.Provider>
    );
};

const useLocaleContext = (): LocaleContextType => {
    const context = React.useContext(LocaleContext);

    if (!context) {
        throw new Error(
            "useLocaleContext must be used within a LocaleContextProvider",
        );
    }

    return context;
};

export type { LocaleContextProviderProps, LocaleContextType };
export { LocaleContextProvider, useLocaleContext };
