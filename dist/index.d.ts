import React, { Context } from "react";
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
 * @description use this instead of React.useContext
 * @param {React.Context} Context a context created with createContext from this package
 * @param {Function | Array | Object | string} selector a function or an array or an object or a string used to select the desired part of the context's value
 * @returns {any} the selected part of the context's value
 */
export declare function useContextSelector<S, R>(
  Context: Context<ContextValue<S>>,
  selector: Selector<S, R> | Array<keyof S> | Partial<S> | keyof S
): R;
/**
 * @description use this instead of React.createContext
 * @returns {React.Context} a context with a Provider that has a value property that is a ref
 */
export declare function createContext<T = unknown>(): Context<ContextValue<T>>;
export {};
