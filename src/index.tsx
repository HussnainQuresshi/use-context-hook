import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  createContext as createContextOriginal,
  ReactNode,
  Context,
} from "react";

/**
 * Type of the listener function
 */
type Listener<T> = (newValue: T, prevVal: T) => void;

/**
 * Type of the context value
 */
interface ContextValue<T> {
  value: React.MutableRefObject<T>;
  registerListener: (listener: Listener<T>) => () => void;
}

/**
 * Type of the selector function
 */
type Selector<S, R> = (state: S) => R;

/**
 * Support for Server Side Rendering
 */
// const isSSR =
//   typeof window === "undefined" ||
//   /ServerSideRendering/.test(window.navigator && window.navigator.userAgent);
const useIsomorphicLayoutEffect = useEffect;

/**
 * @description use this instead of React.useContext
 * @param {React.Context} Context a context created with createContext from this package
 * @param {Function | Array | Object | string} selector a function or an array or an object or a string used to select the desired part of the context's value
 * @returns {any} the selected part of the context's value
 */
export function useContextHook<S, R>(
  Context: Context<ContextValue<S>>,
  selector: Selector<S, R> | Array<keyof S> | Partial<S> | keyof S
): R {
  if (typeof selector === "function")
    return useSelector(Context, selector as Selector<S, R>);
  if (Array.isArray(selector))
    return useSelector(Context, (state: S) =>
      selector.reduce((a, c) => ({ ...a, [c]: state[c] }), {} as Partial<S>)
    ) as R;
  if (typeof selector === "object")
    return useSelector(Context, (state: S) =>
      Object.keys(selector)
        .filter((key) => (selector as Partial<S>)[key as keyof S])
        .reduce(
          (a, c) => ({ ...a, [c]: state[c as keyof S] }),
          {} as Partial<S>
        )
    ) as R;
  if (typeof selector === "string")
    return useSelector(Context, (state: S) => state[selector as keyof S]) as R;
  throw new Error("Invalid selector");
}

/**
 * @description use this instead of React.createContext
 * @returns {React.Context} a context with a Provider that has a value property that is a ref
 */
export function createContextHook<T = unknown>(): Context<ContextValue<T>> {
  const context = createContextOriginal<ContextValue<T>>({
    value: { current: undefined },
    registerListener: () => () => { },
  });
  delete context.Consumer;
  context.Provider = createProvider(context.Provider) as any;
  return context;
}

/**
 * Deep comparison between two values
 * @param {any} obj1 the first value
 * @param {any} obj2 the second value
 * @returns {boolean} true if obj1 and obj2 are deeply equal
 */
function deepCompare(obj1: any = "", obj2: any = ""): boolean {
  if (typeof obj1 != typeof obj2) return false;
  if (typeof obj1 != "object") {
    if (typeof obj1 == "function" && typeof obj2 == "function") return true;
    return obj1 == obj2;
  }
  //handle the null and undefined cases
  if (!obj1 || !obj2) {
    if (!obj1 && !obj2) return true;
    return obj1 == obj2;
  }
  if (Object.keys(obj1).length != Object.keys(obj2).length) {
    return false;
  }
  //deeply compare objects
  for (const key in obj1) {
    if (!deepCompare(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}
/**
 * Creates a provider component with an attached value property
 * @param {React.Provider} ProviderOriginal The original Provider component
 * @returns {React.FC} The new Provider component
 */
function createProvider<T>(
  ProviderOriginal: React.Provider<ContextValue<T>>
): React.FC<{ value: T; children?: ReactNode; }> {
  return ({ value, children }) => {
    const valueRef = useRef(value);
    const listenersRef = useRef(new Set<Listener<T>>());
    const contextValue = useRef<ContextValue<T>>({
      value: valueRef,
      registerListener: (listener: Listener<T>) => {
        listenersRef.current.add(listener);
        return () => listenersRef.current.delete(listener);
      },
    });
    useIsomorphicLayoutEffect(() => {
      listenersRef.current.forEach((listener) => {
        listener(value, valueRef.current);
      });
      valueRef.current = value;
    }, [value]);

    return (
      <ProviderOriginal value={contextValue.current}>
        {children}
      </ProviderOriginal>
    );
  };
}

/**
 * useSelector function
 * @param {React.Context} context The React Context to use
 * @param {Function} selector The function that will select a portion of the context's value
 * @returns {any} The selected portion of the context's value
 */
function useSelector<S, R>(
  context: Context<ContextValue<S>>,
  selector: Selector<S, R>
): R {
  const { value, registerListener } = useContext(context);
  const [selectedValue, setSelectedValue] = useState(() =>
    selector(value.current)
  );
  const selectorRef = useRef(selector);

  useIsomorphicLayoutEffect(() => {
    selectorRef.current = selector;
  }, [selector, selectorRef]);

  useIsomorphicLayoutEffect(() => {
    const updateValueIfNeeded = (newValue: S, prevVal: S) => {
      const newSelectedValue = selectorRef.current(newValue);
      const prevSelectedValue = selectorRef.current(prevVal);
      if (!deepCompare(newSelectedValue, prevSelectedValue)) {
        setSelectedValue(() => newSelectedValue);
      }
    };
    const unregisterListener = registerListener((newValue: S, prevVal: S) =>
      updateValueIfNeeded(newValue, prevVal)
    );
    return unregisterListener;
  }, [registerListener, value]);

  return selectedValue;
}
/**
 * @deprecated use createContextHook instead
 * @description use this instead of React.createContext
 * @returns {React.Context} a context with a Provider that has a value property that is a ref
 */
export const createContext = createContextHook;

/**
 * @deprecated use useContextHook instead
 * @param {React.Context} Context a context created with createContext from this package
 * @param {Function | Array | Object | string} selector a function or an array or an object or a string used to select the desired part of the context's value
 * @returns {any} the selected part of the context's value
 */

export const useContextSelector = useContextHook;
