import type * as React from "react";
import type { ProvidersComponent } from "react-compose-context-providers";

import { withProviders } from "react-compose-context-providers";

import { LocaleContextProvider } from "./contexts/locale";
import { ThemeContextProvider } from "./contexts/theme";

const Providers: ProvidersComponent = withProviders([
    [
        LocaleContextProvider,
    ],
    [
        ThemeContextProvider,
        {
            defaultMode: "dark",
        },
    ],
]);

type ComponentProps = {
    children: React.ReactNode;
};

const Component = (props: ComponentProps): React.JSX.Element => {
    return <Providers>{props.children}</Providers>;
};

export type { ComponentProps };
export { Component };
