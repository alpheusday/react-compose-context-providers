import type * as React from "react";

import { composeProviders } from "react-compose-context-providers";
import { describe, expectTypeOf, it } from "vitest";

import { ThemeCtx } from "#/contexts";

type LabelProviderProps = {
    label: string;
    optional?: boolean;
};

const LabelProvider: React.FC<LabelProviderProps> = () => null;

const defineTestsTypes = (): void => {
    describe("composeProviders types", (): void => {
        it("accepts bare components", (): void => {
            expectTypeOf(
                composeProviders([
                    ThemeCtx.Provider,
                    LabelProvider,
                ]),
            ).toBeFunction();
        });

        it("accepts a single-element tuple", (): void => {
            expectTypeOf(
                composeProviders([
                    [
                        ThemeCtx.Provider,
                    ],
                ]),
            ).toBeFunction();
        });

        it("accepts valid props", (): void => {
            expectTypeOf(
                composeProviders([
                    [
                        ThemeCtx.Provider,
                        {
                            value: "dark",
                        },
                    ],
                ]),
            ).toBeFunction();
        });

        it("accepts an entry with an unknown key mixed with valid keys (documented hole)", (): void => {
            expectTypeOf(
                composeProviders([
                    [
                        LabelProvider,
                        {
                            label: "x",
                            bogus: true,
                        },
                    ],
                ]),
            ).toBeFunction();
        });

        it("accepts a mix of bare components, tuples and props", (): void => {
            expectTypeOf(
                composeProviders([
                    ThemeCtx.Provider,
                    [
                        ThemeCtx.Provider,
                        {
                            value: "dark",
                        },
                    ],
                    [
                        LabelProvider,
                        {
                            label: "x",
                            optional: true,
                        },
                    ],
                ]),
            ).toBeFunction();
        });

        it("rejects an invalid prop key", (): void => {
            expectTypeOf(
                composeProviders([
                    [
                        ThemeCtx.Provider,
                        {
                            // @ts-expect-error
                            wrong: "dark",
                        },
                    ],
                ]),
            ).toBeFunction();
        });

        it("rejects a wrong prop value type", (): void => {
            expectTypeOf(
                composeProviders([
                    [
                        ThemeCtx.Provider,
                        {
                            // @ts-expect-error
                            value: 123,
                        },
                    ],
                ]),
            ).toBeFunction();
        });

        it("rejects an invalid-only prop key", (): void => {
            expectTypeOf(
                composeProviders([
                    [
                        LabelProvider,
                        {
                            // @ts-expect-error
                            bogus: true,
                        },
                    ],
                ]),
            ).toBeFunction();
        });

        it("rejects missing required props", (): void => {
            expectTypeOf(
                composeProviders([
                    [
                        LabelProvider,
                        // @ts-expect-error
                        {},
                    ],
                ]),
            ).toBeFunction();
        });
    });
};

export { defineTestsTypes };
