import type { ProvidersComponent } from "react-compose-context-providers";

import { render, screen } from "@testing-library/react";
import * as React from "react";
import { withProviders } from "react-compose-context-providers";
import { describe, expect, it } from "vitest";

type Theme = "light" | "dark";

const ThemeCtx: React.Context<Theme> = React.createContext<Theme>("light");

type I18n = "en" | "fr" | "ja";

const I18nCtx: React.Context<I18n> = React.createContext<I18n>("en");

const AuthCtx: React.Context<boolean> = React.createContext<boolean>(false);

describe("withProviders", (): void => {
    it("returns children unchanged when no providers are given", (): void => {
        const text = "Hello, World!" as const;

        const Providers: ProvidersComponent = withProviders([]);

        const Component = (): React.JSX.Element => (
            <Providers>
                <span>{text}</span>
            </Providers>
        );

        render(<Component />);

        expect(screen.getByText(text)).toBeDefined();
    });

    it("wraps children with a single provider", (): void => {
        const Providers: ProvidersComponent = withProviders([
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
        const Providers: ProvidersComponent = withProviders([
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
        const Providers: ProvidersComponent = withProviders([
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

    it("works with a provider that requires no props", (): void => {
        const Passthrough: React.FC<{
            children: React.ReactNode;
        }> = ({ children }) => <>{children}</>;

        const Providers: ProvidersComponent = withProviders([
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

        const Providers: ProvidersComponent = withProviders([
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
    });
});
