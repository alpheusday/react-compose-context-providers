import Path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            react: Path.resolve(import.meta.dirname, "node_modules", "react"),
            "react-dom": Path.resolve(
                import.meta.dirname,
                "node_modules",
                "react-dom",
            ),
            "@testing-library/react": Path.resolve(
                import.meta.dirname,
                "node_modules",
                "@testing-library",
                "react",
            ),
        },
        tsconfigPaths: true,
    },
    test: {
        environment: "happy-dom",
        logHeapUsage: true,
    },
});
