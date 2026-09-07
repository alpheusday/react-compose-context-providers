import type * as React from "react";

import { createContext } from "react";

type Theme = "light" | "dark";

const ThemeCtx: React.Context<Theme> = createContext<Theme>("light");

type I18n = "en" | "fr" | "ja";

const I18nCtx: React.Context<I18n> = createContext<I18n>("en");

const AuthCtx: React.Context<boolean> = createContext<boolean>(false);

export type { I18n, Theme };
export { AuthCtx, I18nCtx, ThemeCtx };
