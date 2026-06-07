import * as React from "react";

/**
 * Any React component.
 */
type AnyComponent = React.ComponentType<any>;

/**
 * React component props without the `children` prop.
 */
type ComponentProps<C extends AnyComponent> = Omit<
    React.ComponentProps<C>,
    "children"
>;

/**
 * Validate that the provider has the correct props,
 * and omit the `children` prop.
 */
type ValidatedComponent<T> = T extends [
    infer C extends AnyComponent,
]
    ? [
          C,
      ]
    : T extends [
            infer C extends AnyComponent,
            infer P,
        ]
      ? P extends ComponentProps<C>
          ? T
          : [
                C,
                ComponentProps<C> & {
                    [K in keyof P]: K extends keyof ComponentProps<C>
                        ? ComponentProps<C>[K]
                        : never;
                },
            ]
      : never;

/**
 * `Providers` component props.
 */
type ProviderProps = {
    children: React.JSX.Element;
};

/**
 * Create a `Providers` component with the given providers.
 *
 * ### Example
 *
 * ```tsx
 * import type { ProvidersComponent } from "react-compose-context-providers";
 *
 * import * as React from "react";
 * import { withProviders } from "react-compose-context-providers";
 *
 * type Theme = "system" | "light" | "dark";
 *
 * const ThemeCtx: React.Context<Theme> = React.createContext<Theme>("system");
 *
 * const Providers: ProvidersComponent = withProviders([
 *     [
 *         ThemeCtx.Provider,
 *         {
 *             value: "light",
 *         },
 *     ]
 * ]);
 *
 * const Component = (): React.JSX.Element => {
 *     const theme: Theme = React.useContext(ThemeCtx);
 *     return <div>{theme}</div>;
 * };
 * ```
 */
const withProviders = <
    const T extends readonly (
        | [
              AnyComponent,
          ]
        | [
              AnyComponent,
              Record<string, unknown>,
          ]
    )[],
>(
    providers: [
        ...{
            [K in keyof T]: ValidatedComponent<T[K]>;
        },
    ],
): ((props: ProviderProps) => React.ReactElement) => {
    return (props: ProviderProps): React.ReactElement => {
        return providers.reduceRight(
            (acc, entry) =>
                React.createElement(entry[0], entry[1] ?? null, acc),
            props.children,
        );
    };
};

/**
 * The `Providers` component.
 */
type ProvidersComponent = ReturnType<typeof withProviders>;

export type {
    AnyComponent,
    ComponentProps,
    ProviderProps,
    ProvidersComponent,
    ValidatedComponent,
};
export { withProviders };
