set shell := ["bash", "-cu"]
set windows-shell := ["pwsh", "-Command"]

tsc := "pnpm exec tsc"
biome := "pnpm exec biome"
tsdown := "pnpm exec tsdown"
vitest := "pnpm exec vitest"
typedoc := "pnpm exec typedoc"

publish_dev := "pnpm publish --no-git-checks --tag dev --access public"
publish := "pnpm publish --access public"

pkg := "package"

test_helpers := "tests/helpers"
test_18 := "tests/react18"
test_19 := "tests/react19"

# Default action
_:
    just --list -u

# Install
i:
    pnpm install

# Format code
fmt:
    {{biome}} check --write .

# Lint code with ls-lint
ls-lint:
    cd ./{{pkg}}/src && ls-lint -config ../../.ls-lint.yaml

# Lint code with ls-lint
lslint: ls-lint

# Lint code with typos-cli
typos:
    typos

# Lint code with TypeScript Compiler
tsc:
    cd ./{{pkg}} && {{tsc}} --noEmit
    cd ./{{test_18}} && {{tsc}} --noEmit
    cd ./{{test_19}} && {{tsc}} --noEmit

# Lint code
lint: lslint typos tsc

# Lint code with Biome
lint-biome:
    {{biome}} lint .

# Build package
build:
    cd ./{{pkg}} && {{tsdown}} -c tsdown.config.ts

# Build package for test
build-test:
    cd ./{{test_helpers}} && {{tsdown}} -c tsdown.config.ts

# Test package against React 18 only
test-18: build-test build
    cd ./{{test_18}} && {{vitest}} run

# Test package against React 19 only
test-19: build-test build
    cd ./{{test_19}} && {{vitest}} run

# Test package
test: test-18 test-19

# Check code
check: fmt build build-test lint test

# Publish package with dev tag as dry-run
publish-dev-try:
    cd ./{{pkg}} && {{publish_dev}} --dry-run

# Publish package with dev tag
publish-dev:
    cd ./{{pkg}} && {{publish_dev}}

# Publish package as dry-run
publish-try:
    cd ./{{pkg}} && {{publish}} --dry-run

# Publish package
publish:
    cd ./{{pkg}} && {{publish}}

# Clean builds (Linux)
clean-linux:
    rm -rf ./{{pkg}}/dist
    rm -rf ./{{test_helpers}}/dist

# Clean builds (macOS)
clean-macos: clean-linux

# Clean builds (Windows)
clean-windows:
    if (Test-Path "./{{pkg}}/dist") { Remove-Item -Recurse -Force "./{{pkg}}/dist" }
    if (Test-Path "./{{test_helpers}}/dist") { Remove-Item -Recurse -Force "./{{test_helpers}}/dist" }

# Clean builds
clean:
    just clean-{{os()}}

# Clean everything (Linux)
clean-all-linux:
    just clean

    rm -rf ./{{test_18}}/node_modules
    rm -rf ./{{test_19}}/node_modules
    rm -rf ./{{test_helpers}}/node_modules

    rm -rf ./{{pkg}}/node_modules

    rm -rf ./node_modules

# Clean everything (macOS)
clean-all-macos: clean-all-linux

# Clean everything (Windows)
clean-all-windows:
    just clean

    if (Test-Path "./{{test_18}}/node_modules") { Remove-Item -Recurse -Force "./{{test_18}}/node_modules" }
    if (Test-Path "./{{test_19}}/node_modules") { Remove-Item -Recurse -Force "./{{test_19}}/node_modules" }
    if (Test-Path "./{{test_helpers}}/node_modules") { Remove-Item -Recurse -Force "./{{test_helpers}}/node_modules" }

    if (Test-Path "./{{pkg}}/node_modules") { Remove-Item -Recurse -Force "./{{pkg}}/node_modules" }

    if (Test-Path "./node_modules") { Remove-Item -Recurse -Force "./node_modules" }

# Clean everything
clean-all:
    just clean-all-{{os()}}
