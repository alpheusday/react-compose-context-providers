import * as React from "react";
import { composeProviders } from "react-compose-context-providers";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AuthCtx, I18nCtx, ThemeCtx } from "../contexts";

const defineTestsSSR = (): void => {
    describe("composeProviders SSR", (): void => {
        it("renders provider-fed values with renderToString", (): void => {
            const Providers = composeProviders([
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

            const html: string = renderToString(<Component />);

            expect(html.replace(/<!-- -->/g, "")).toContain("dark-fr");
        });

        it("renders children unchanged with no providers", (): void => {
            const Providers = composeProviders([]);

            const text = "ssr-empty" as const;

            const Component = (): React.JSX.Element => (
                <Providers>
                    <span>{text}</span>
                </Providers>
            );

            const html: string = renderToString(<Component />);

            expect(html).toContain(text);
        });

        it("renders with a single provider", (): void => {
            const Providers = composeProviders([
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

            const html: string = renderToString(<Component />);

            expect(html).toContain("dark");
        });

        it("renders with a bare provider (no props)", (): void => {
            const Passthrough: React.FC<{
                children: React.ReactNode;
            }> = ({ children }) => <>{children}</>;

            const Providers = composeProviders([
                Passthrough,
            ]);

            const text = "ssr-bare" as const;

            const Component = (): React.JSX.Element => (
                <Providers>
                    <span>{text}</span>
                </Providers>
            );

            const html: string = renderToString(<Component />);

            expect(html).toContain(text);
        });

        it("propagates context through three nested providers", (): void => {
            const Providers = composeProviders([
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

            const html: string = renderToString(<Component />);

            expect(html.replace(/<!-- -->/g, "")).toContain("darkjatrue");
        });
    });
};

export { defineTestsSSR };
