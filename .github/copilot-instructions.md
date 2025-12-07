# AI Agent Instructions for use-context-hook

## Project Overview
This is a React hook library that solves context re-render optimization through selective state subscriptions. The core API (`createContextHook` + `useContextHook`) allows components to subscribe to specific context slices, triggering re-renders only when selected values change - similar to Redux selectors.

**Core files:**
- `src/index.tsx`: Single-file implementation (~200 lines) containing all hook logic
- `examples/`: Four usage pattern demonstrations (single_str, redux_based, obj_based, multiple_strs)
- `__tests__/`: Jest specs validating selective re-render behavior

## Architecture & Key Patterns

### 1. Custom Context Implementation
The library **replaces** React's standard context API:
```tsx
// Don't use React.createContext - use our custom implementation
const Context = createContextHook(); // Not createContext()

// Provider wraps values in a ref-based listener system
<Context.Provider value={{ count, setCount }}>
```

**Why:** Standard `useContext` causes all consumers to re-render on any context change. This implementation uses a ref-based value store (`valueRef`) + listener registry to enable selective subscriptions.

### 2. Four Selector Patterns
All examples demonstrate different ways to use `useContextHook` with the same underlying logic:

```tsx
// Single string: extracts one value
const count = useContextHook(Context, "count");

// Array: picks multiple keys
const { count, setCount } = useContextHook(Context, ["count", "setCount"]);

// Object: explicitly lists desired keys (any truthy value means "include")
const { count, setCount } = useContextHook(Context, { count: 1, setCount: 1 });

// Function (Redux-style): custom selector logic
const { count, setCount } = useContextHook(Context, v => ({ count: v.count, setCount: v.setCount }));
```

All four patterns use the same `useSelector` function internally, which registers a listener and compares previous/new selected values via `deepCompare`.

### 3. Deep Comparison for Re-render Prevention
The `deepCompare` function (lines 100-120 in `src/index.tsx`) recursively compares selected values:
- Handles primitives, objects, arrays, null/undefined
- Treats functions as always equal (avoids unnecessary re-renders for stable callbacks)
- This is **critical** - without it, object/array selectors would cause re-renders on every context update

**Test validation:** All specs verify that ComponentB doesn't re-render when ComponentA updates unrelated state, even with deeply nested `complexObj` in context.

## Development Workflows

### Building & Testing
```bash
npm run build          # Compiles TypeScript to dist/ (used by examples + tests)
npm test               # Runs Jest specs (tests import from dist/, not src/)
npm run tsc-test       # Type-checks without emitting files

# IMPORTANT: Always rebuild before testing after src/ changes
npm run build && npm test
```

**Gotcha:** Tests import `createContext, useContextHook from "../dist"` - if you modify `src/index.tsx`, you **must** rebuild for tests to pick up changes.

### Running Examples
Examples use webpack-dev-server with a parameterized entry point:
```bash
npm run example:single_str      # Demonstrates single string selector
npm run example:redux_based     # Demonstrates function/Redux selector
npm run example:obj_based       # Demonstrates object-based selector
npm run example:multiple_strs   # Demonstrates array selector
```

**How it works:** `webpack.config.js` reads `process.env.DIR` to dynamically set entry/template paths. Examples alias `use-context-hook` to `${__dirname}/dist`, so rebuild the package if changing core logic.

### Component Structure in Examples
All examples follow identical structure (aids comparison):
```
examples/<pattern>/
  src/
    index.jsx          # Root app wrapper with ContextProvider
    context/index.jsx  # Creates Context + ContextProvider (count/text state)
    components/
      componentA/      # Updates count (with random number to show re-renders)
      componentB/      # Updates text (with random number to show re-renders)
```

**Key insight:** Each component displays `{(Math.random() * 10000).toFixed(0)}` - this number changes only on re-render, making selective updates visually obvious.

## Code Conventions

### TypeScript Usage
- Main library is TypeScript (`src/index.tsx`)
- Examples/tests use plain JSX (no types)
- Generic types flow through: `createContextHook<T>()` → `Context<ContextValue<T>>` → `useContextHook<S, R>(...)`
- Export both current names (`createContextHook`, `useContextHook`) and deprecated aliases (`createContext`, `useContextSelector`)

### React Patterns
- **Never delete `context.Consumer`** after creating context - the code explicitly does `delete context.Consumer` (line 76) because our custom Provider is incompatible
- **Always wrap examples in `memo`** with `() => true` comparator to prevent parent-triggered re-renders (see README examples)
- Use `useIsomorphicLayoutEffect` (aliased to `useEffect` - SSR support commented out) for listener registration

### Test Assertions
Tests verify **render count** via `useRef`:
```jsx
const renderCount = useRef(0);
renderCount.current += 1;
// ... later assert on renderCount via data-testid
```

**Critical test pattern:** All specs create a deeply nested `complexObj` in context value - ensures `deepCompare` handles nested structures correctly.

## Common Tasks

### Adding a New Selector Pattern
1. Add case in `useContextHook` function (lines 45-65)
2. Transform selector to a function form that `useSelector` can consume
3. Add example in `examples/` following existing structure
4. Add test spec in `__tests__/` validating selective re-render
5. Document in README API section

### Modifying Core Hook Logic
1. Edit `src/index.tsx`
2. Run `npm run build` (tests won't see changes otherwise)
3. Run `npm test` to verify no regressions
4. Test all four examples manually (`npm run example:*`)

### Debugging Re-render Issues
- Add `console.log` in `deepCompare` to see comparison logic
- Check if `selectorRef.current` is stable (updated in `useIsomorphicLayoutEffect`)
- Verify `listenersRef.current.forEach` fires in Provider's effect (line 132)
- Use React DevTools Profiler with examples to visualize re-renders

## Integration Notes

**Package exports:**
- Main: `dist/index.js` (CommonJS)
- Types: `dist/index.d.ts`
- Source maps: `dist/index.js.map`

**Peer dependencies:** React 18+ (declared in devDependencies, should be peer in real usage)

**Breaking changes from standard React Context:**
- Must use `createContextHook` instead of `React.createContext`
- Must pass selector to `useContextHook` (no direct value access)
- Provider's `value` prop must be an object (since selectors expect keyed access)
