import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useLayoutEffect,
  createContext as createContextOriginal,
} from "react";
/**
 * Support for Server Side Rendering
 */
const isSSR =
  typeof window === "undefined" ||
  /ServerSideRendering/.test(window.navigator && window.navigator.userAgent);
const useIsomorphicLayoutEffect = isSSR ? useEffect : useLayoutEffect;
/**
 * @description use this instead of React.useContext
 * @param {*} Context a context created with createContext from this package
 * @param {*} selector | ["key","key","key"] || {key:1,key:,key:1} || (state)=>({ key1:state.key}) || (state)=>state.key
 * @returns
 */
export function useContextSelector(Context, selector) {
  if (typeof selector === "function") return useSelector(Context, selector);
  if (Array.isArray(selector))
    return useSelector(Context, (_) =>
      selector.reduce((a, c) => ({ ...a, [c]: _[c] }), {})
    );
  if (typeof selector === "object")
    return useSelector(Context, (_) =>
      Object.keys(selector)
        .filter((_) => selector[_])
        .reduce((a, c) => ({ ...a, [c]: _[c] }), {})
    );
  if (typeof selector === "string")
    return useSelector(Context, (_) => _[selector]);
  throw new Error("Invalid selector");
}

/**
 * @description use this instead of React.createContext
 * @returns a context with a Provider that has a value property that is a ref
 */
export function createContext() {
  const context = createContextOriginal();
  delete context.Consumer;
  context.Provider = createProvider(context.Provider);
  return context;
}
/**
 * @param {*} obj1
 * @param {*} obj2
 * @returns true if obj1 and obj2 are deeply equal
 */
const isDeepStrictEqual = (obj1, obj2) => {
  if (typeof obj1 !== typeof obj2) return false;
  if (typeof obj1 !== "object") {
    if (typeof obj1 === "function" && typeof obj2 === "function") return true;
    return obj1 === obj2;
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (let key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
};
function createProvider(ProviderOriginal) {
  return ({ value, children }) => {
    const valueRef = useRef(value);
    const listenersRef = useRef(new Set());
    const contextValue = useRef({
      value: valueRef,
      registerListener: (listener) => {
        listenersRef.current.add(listener);
        return () => listenersRef.current.delete(listener);
      },
      listeners: new Set(),
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

function useSelector(context, selector) {
  const { value, registerListener } = useContext(context);
  const [selectedValue, setSelectedValue] = useState(() =>
    selector(value.current)
  );
  const selectorRef = useRef(selector);

  useIsomorphicLayoutEffect(() => {
    selectorRef.current = selector;
  }, [selector, selectorRef]);

  useIsomorphicLayoutEffect(() => {
    const updateValueIfNeeded = (newValue, prevVal) => {
      const newS = selectorRef.current(newValue);
      const prevS = selectorRef.current(prevVal);
      console.log({
        newS,
        prevS,
        isEqual: !isDeepStrictEqual(newS, prevS),
      });
      if (!isDeepStrictEqual(newS, prevS)) {
        setSelectedValue(() => newS);
      }
    };
    const unregisterListener = registerListener((_, prevVal) =>
      updateValueIfNeeded(_, prevVal)
    );
    return unregisterListener;
  }, [registerListener, value]);

  return selectedValue;
}
