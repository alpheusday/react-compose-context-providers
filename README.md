# React Compose Context Providers

A tiny React context provider composer.

## Installation

Install this package as a dependency in the project:

```sh
# npm
npm i react-compose-context-providers

# Yarn
yarn add react-compose-context-providers

# pnpm
pnpm add react-compose-context-providers

# Deno
deno add npm:react-compose-context-providers

# Bun
bun add react-compose-context-providers
```

## Usage

Use the `composeProviders` function from the package to avoid nesting hell:

```tsx
import type * as React from "react";
import { ComposedProviders } from "react-compose-context-providers";

import { composeProviders } from "react-compose-context-providers";

import { ThemeProvider } from "./contexts/theme";
import { LocaleProvider } from "./contexts/locale";

const Providers: ComposedProviders = composeProviders([
    [
        ThemeProvider,
        {
            defaultTheme: "dark",
        },
    ],
    LocaleProvider,
]);

type ComponentProps = {
    children: React.ReactNode;
};

const Component = (props: ComponentProps): React.JSX.Element => {
    return <Providers>{props.children}</Providers>;
};
```

## Contributing

For contributing, please refer to the [contributing guide](./CONTRIBUTING.md).

## License

This project is licensed under the terms of the MIT license.
