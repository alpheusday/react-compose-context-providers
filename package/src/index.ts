import * as React from "react";

/**
 * Provider component type.
 */
type ProviderComponent = React.ComponentType<any>;

/**
 * Provider component props without the `children` prop.
 */
type ProviderProps<C extends ProviderComponent> = Omit<
    React.ComponentProps<C>,
    "children"
>;

/**
 * A provider entry: either a component, [Component], or [Component, Props].
 * Validates props against the component and omits the `children` prop.
 */
type ProviderEntry<T> =
    // Component
    T extends ProviderComponent
        ? T
        : // [Component]
          T extends [
                infer C extends ProviderComponent,
            ]
          ? [
                C,
            ]
          : // [Component, Props]
            T extends [
                  infer C extends ProviderComponent,
                  infer P,
              ]
            ? P extends ProviderProps<C>
                ? // Valid: all props match the component's expected shape
                  T
                : // Invalid: surface a type error by narrowing mismatched
                  // keys to never, so the user sees which props are invalid
                  [
                      C,
                      ProviderProps<C> & {
                          [K in keyof P]: K extends keyof ProviderProps<C>
                              ? ProviderProps<C>[K]
                              : never;
                      },
                  ]
            : never;

/**
 * A provider entries tuple with validated props.
 */
type ProviderEntries<T> = {
    [K in keyof T]: ProviderEntry<T[K]>;
};

/**
 * Props for the composed providers component.
 */
type ComposedProvidersProps = {
    children?: React.ReactNode;
};

/**
 * The composed providers component.
 */
type ComposedProviders = (props: ComposedProvidersProps) => React.ReactNode;

/**
 * Create a `Providers` component with the given providers.
 *
 * ### Example
 *
 * ```ts
 * import type * as React from "react";
 * import type { ComposedProviders } from "react-compose-context-providers";
 *
 * import { composeProviders } from "react-compose-context-providers";
 *
 * import { ThemeProvider } from "./contexts/theme";
 * import { LocaleProvider } from "./contexts/locale";
 *
 * const Providers: ComposedProviders = composeProviders([
 *     [
 *         ThemeProvider,
 *         {
 *             defaultTheme: "dark",
 *         },
 *     ],
 *     LocaleProvider,
 * ]);
 *
 * type ComponentProps = {
 *     children: React.ReactNode;
 * };
 *
 * const Component = (props: ComponentProps): React.JSX.Element => {
 *     return <Providers>{props.children}</Providers>;
 * };
 * ```
 */
const composeProviders = <
    const T extends readonly (
        | ProviderComponent
        | [
              ProviderComponent,
          ]
        | [
              ProviderComponent,
              Record<string, unknown>,
          ]
    )[],
>(
    providers: [
        ...ProviderEntries<T>,
    ],
): ComposedProviders => {
    return (props: ComposedProvidersProps): React.ReactNode => {
        return providers.reduceRight(
            (
                acc: React.ReactNode,
                entry: ProviderEntries<T>[number],
            ): React.ReactNode => {
                const normalized: [
                    ProviderComponent,
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

export type {
    ComposedProviders,
    ComposedProvidersProps,
    ProviderComponent,
    ProviderEntries,
    ProviderEntry,
    ProviderProps,
};
export { composeProviders };
