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
type ValidatedComponent<T> =
    // Component
    T extends AnyComponent
        ? T
        : // [Component]
          T extends [
                infer C extends AnyComponent,
            ]
          ? [
                C,
            ]
          : // [Component, Props]
            T extends [
                  infer C extends AnyComponent,
                  infer P,
              ]
            ? P extends ComponentProps<C>
                ? // Valid: all props match the component's expected shape
                  T
                : // Invalid: surface a type error by narrowing mismatched
                  // keys to never, so the user sees which props are invalid
                  [
                      C,
                      ComponentProps<C> & {
                          [K in keyof P]: K extends keyof ComponentProps<C>
                              ? ComponentProps<C>[K]
                              : never;
                      },
                  ]
            : never;

/**
 * Validated providers.
 */
type ValidatedProviders<T> = {
    [K in keyof T]: ValidatedComponent<T[K]>;
};

/**
 * `Providers` component props.
 */
type ProviderProps = {
    children?: React.ReactNode;
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
        | AnyComponent
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
        ...ValidatedProviders<T>,
    ],
): ((props: ProviderProps) => React.ReactNode) => {
    return (props: ProviderProps): React.ReactNode => {
        return providers.reduceRight(
            (
                acc: React.ReactNode,
                entry: ValidatedProviders<T>[number],
            ): React.ReactNode => {
                const normalized: [
                    AnyComponent,
                    Record<string, unknown> | undefined,
                ] = Array.isArray(entry)
                    ? [
                          entry[0],
                          entry[1],
                      ]
                    : [
                          entry,
                          void 0,
                      ];

                return React.createElement(
                    normalized[0],
                    normalized[1] ?? null,
                    acc,
                );
            },
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
    ValidatedProviders,
};
export { withProviders };
