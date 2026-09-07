import { defineConfig } from "@apst/tsdown";
import { dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: [
            "./src/index.ts",
        ],
        platform: "node",
    },
    [
        esmPreset(),
        dtsPreset({
            presetOptions: {
                performanceMode: true,
            },
        }),
    ],
);
