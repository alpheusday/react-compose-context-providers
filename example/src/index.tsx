import type * as React from "react";
import type { ComposedProviders } from "react-compose-context-providers";

import { composeProviders } from "react-compose-context-providers";

import { LocaleContextProvider } from "./contexts/locale";
import { ThemeContextProvider } from "./contexts/theme";

const Providers: ComposedProviders = composeProviders([
    [
        ThemeContextProvider,
        {
            defaultMode: "dark",
        },
    ],
    LocaleContextProvider,
]);

type ComponentProps = {
    children: React.ReactNode;
};

const Component = (props: ComponentProps): React.JSX.Element => {
    return <Providers>{props.children}</Providers>;
};

export type { ComponentProps };
export { Component };
