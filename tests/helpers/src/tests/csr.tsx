import type { ComposedProviders } from "react-compose-context-providers";

import type { Theme } from "#/contexts";

import { render, screen } from "@testing-library/react";
import * as React from "react";
import { composeProviders } from "react-compose-context-providers";
import { describe, expect, it } from "vitest";

import { AuthCtx, I18nCtx, ThemeCtx } from "#/contexts";

const defineTestsCSR = (): void => {
    describe("composeProviders", (): void => {
        it("returns children unchanged when no providers are given", (): void => {
            const text = "Hello, World!" as const;

            const Providers: ComposedProviders = composeProviders([]);

            const Component = (): React.JSX.Element => (
                <Providers>
                    <span>{text}</span>
                </Providers>
            );

            render(<Component />);

            expect(screen.getByText(text)).toBeDefined();
        });

        it("renders nothing without crashing when given no children", (): void => {
            const Providers: ComposedProviders = composeProviders([]);

            const { container } = render(<Providers />);

            expect(container.innerHTML).toBe("");
        });

        it("accepts a bare provider without array wrapper", (): void => {
            const Passthrough: React.FC<{
                children: React.ReactNode;
            }> = ({ children }) => <>{children}</>;

            const text = "bare" as const;

            const Providers: ComposedProviders = composeProviders([
                Passthrough,
            ]);

            const Component = (): React.JSX.Element => (
                <Providers>
                    <span>{text}</span>
                </Providers>
            );

            render(<Component />);

            expect(screen.getByText(text)).toBeDefined();
        });

        it("accepts a bare provider with optional props", (): void => {
            const OptionalPassthrough: React.FC<{
                children: React.ReactNode;
                label?: string;
            }> = ({ children }) => <>{children}</>;

            const text = "optional" as const;

            const Providers: ComposedProviders = composeProviders([
                OptionalPassthrough,
            ]);

            const Component = (): React.JSX.Element => (
                <Providers>
                    <span>{text}</span>
                </Providers>
            );

            render(<Component />);

            expect(screen.getByText(text)).toBeDefined();
        });

        it("works with a provider that requires no props", (): void => {
            const Passthrough: React.FC<{
                children: React.ReactNode;
            }> = ({ children }) => <>{children}</>;

            const Providers: ComposedProviders = composeProviders([
                [
                    Passthrough,
                ],
            ]);

            const text = "passthrough" as const;

            const Component = (): React.JSX.Element => (
                <Providers>
                    <span>{text}</span>
                </Providers>
            );

            render(<Component />);

            expect(screen.getByText(text)).toBeDefined();
        });

        it("wraps children with a single provider", (): void => {
            const Providers: ComposedProviders = composeProviders([
                [
                    ThemeCtx.Provider,
                    {
                        value: "dark",
                    },
                ],
            ]);

            const Display = (): React.JSX.Element => {
                const theme: string = React.useContext(ThemeCtx);

                return <span>{theme}</span>;
            };

            const Component = (): React.JSX.Element => (
                <Providers>
                    <Display />
                </Providers>
            );

            render(<Component />);

            expect(screen.getByText("dark")).toBeDefined();
        });

        it("nests providers so that the first element is outermost", (): void => {
            const Providers: ComposedProviders = composeProviders([
                [
                    ThemeCtx.Provider,
                    {
                        value: "dark",
                    },
                ],
                [
                    I18nCtx.Provider,
                    {
                        value: "fr",
                    },
                ],
            ]);

            const Display = (): React.JSX.Element => {
                const theme: string = React.useContext(ThemeCtx);

                const i18n: string = React.useContext(I18nCtx);

                return (
                    <span>
                        {theme}-{i18n}
                    </span>
                );
            };

            const Component = (): React.JSX.Element => (
                <Providers>
                    <Display />
                </Providers>
            );

            render(<Component />);

            expect(screen.getByText("dark-fr")).toBeDefined();
        });

        it("propagates context through three nested providers", (): void => {
            const Providers: ComposedProviders = composeProviders([
                [
                    ThemeCtx.Provider,
                    {
                        value: "dark",
                    },
                ],
                [
                    I18nCtx.Provider,
                    {
                        value: "ja",
                    },
                ],
                [
                    AuthCtx.Provider,
                    {
                        value: true,
                    },
                ],
            ]);

            const Display = (): React.JSX.Element => {
                const theme: string = React.useContext(ThemeCtx);

                const i18n: string = React.useContext(I18nCtx);

                const auth: boolean = React.useContext(AuthCtx);

                return (
                    <span>
                        {String(theme)}
                        {i18n}
                        {String(auth)}
                    </span>
                );
            };

            const Component = (): React.JSX.Element => (
                <Providers>
                    <Display />
                </Providers>
            );

            render(<Component />);

            expect(screen.getByText("darkjatrue")).toBeDefined();
        });

        it("mixes bare providers with providers that have props", (): void => {
            const Passthrough: React.FC<{
                children: React.ReactNode;
            }> = ({ children }) => <>{children}</>;

            const Providers: ComposedProviders = composeProviders([
                Passthrough,
                [
                    ThemeCtx.Provider,
                    {
                        value: "dark",
                    },
                ],
            ]);

            const text = "bare-mixed" as const;

            const Display = (): React.JSX.Element => {
                const theme: string = React.useContext(ThemeCtx);

                return (
                    <span>
                        {theme}-{text}
                    </span>
                );
            };

            const Component = (): React.JSX.Element => (
                <Providers>
                    <Display />
                </Providers>
            );

            render(<Component />);

            expect(screen.getByText(`dark-${text}`)).toBeDefined();
        });

        it("accepts a tuple entry with explicitly undefined props", (): void => {
            const OptionalProvider: React.FC<{
                children?: React.ReactNode;
                value?: Theme;
            }> = ({ children, value }): React.JSX.Element => (
                <ThemeCtx.Provider value={value ?? "light"}>
                    {children}
                </ThemeCtx.Provider>
            );

            const Providers: ComposedProviders = composeProviders([
                [
                    OptionalProvider,
                    undefined as unknown as Record<string, unknown>,
                ],
            ]);

            const Display = (): React.JSX.Element => {
                const theme: Theme = React.useContext(ThemeCtx);

                return <span>{theme}</span>;
            };

            const Component = (): React.JSX.Element => (
                <Providers>
                    <Display />
                </Providers>
            );

            render(<Component />);

            expect(screen.getByText("light")).toBeDefined();
        });

        it("passes only the specified props to each provider", () => {
            const callLog: Array<
                [
                    string,
                    string,
                ]
            > = [];

            const Tracker: React.Context<string> =
                React.createContext<string>("none");

            const Wrapper: React.FC<{
                value: string;
            }> = Tracker.Provider;

            const Providers: ComposedProviders = composeProviders([
                [
                    Wrapper,
                    {
                        value: "first",
                    },
                ],
                [
                    Wrapper,
                    {
                        value: "second",
                    },
                ],
            ]);

            const Display = (): React.JSX.Element => {
                const value: string = React.useContext(Tracker);

                callLog.push([
                    "read",
                    value,
                ]);

                return <span>{value}</span>;
            };

            const Component = (): React.JSX.Element => (
                <Providers>
                    <Display />
                </Providers>
            );

            render(<Component />);

            expect(screen.getByText("second")).toBeDefined();
            expect(callLog).toStrictEqual([
                [
                    "read",
                    "second",
                ],
            ]);
        });

        it("renders the same provider repeated with identical props", (): void => {
            const Ctx: React.Context<string> =
                React.createContext<string>("none");

            const Wrapper: React.FC<{
                value: string;
            }> = Ctx.Provider;

            const Providers: ComposedProviders = composeProviders([
                [
                    Wrapper,
                    {
                        value: "same",
                    },
                ],
                [
                    Wrapper,
                    {
                        value: "same",
                    },
                ],
            ]);

            const Display = (): React.JSX.Element => {
                const value: string = React.useContext(Ctx);

                return <span>{value}</span>;
            };

            const Component = (): React.JSX.Element => (
                <Providers>
                    <Display />
                </Providers>
            );

            render(<Component />);

            expect(screen.getByText("same")).toBeDefined();
        });

        it("reuses the composed component across parent re-renders without remounting", (): void => {
            let mountCount: number = 0;

            const Passthrough: React.FC<{
                children: React.ReactNode;
            }> = ({ children }) => <>{children}</>;

            const Providers: ComposedProviders = composeProviders([
                Passthrough,
            ]);

            const Inner = (): React.JSX.Element => {
                React.useEffect((): void => {
                    mountCount += 1;
                }, []);

                return <span>stable</span>;
            };

            const Parent = (props: { label: string }): React.JSX.Element => (
                <Providers>
                    <Inner />
                    <span>{props.label}</span>
                </Providers>
            );

            const { rerender } = render(<Parent label="one" />);

            rerender(<Parent label="two" />);

            expect(screen.getByText("stable")).toBeDefined();
            expect(screen.getByText("two")).toBeDefined();
            expect(mountCount).toBe(1);
        });
    });
};

export { defineTestsCSR };
