"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContextSelector = exports.createContext = exports.createContextHook = exports.useContextHook = void 0;
var react_1 = __importStar(require("react"));
/**
 * Support for Server Side Rendering
 */
// const isSSR =
//   typeof window === "undefined" ||
//   /ServerSideRendering/.test(window.navigator && window.navigator.userAgent);
var useIsomorphicLayoutEffect = react_1.useEffect;
/**
 * @description use this instead of React.useContext
 * @param {React.Context} Context a context created with createContext from this package
 * @param {Function | Array | Object | string} selector a function or an array or an object or a string used to select the desired part of the context's value
 * @returns {any} the selected part of the context's value
 */
function useContextHook(Context, selector) {
    if (typeof selector === "function")
        return useSelector(Context, selector);
    if (Array.isArray(selector))
        return useSelector(Context, function (state) {
            return selector.reduce(function (a, c) {
                var _a;
                return (__assign(__assign({}, a), (_a = {}, _a[c] = state[c], _a)));
            }, {});
        });
    if (typeof selector === "object")
        return useSelector(Context, function (state) {
            return Object.keys(selector)
                .filter(function (key) { return selector[key]; })
                .reduce(function (a, c) {
                var _a;
                return (__assign(__assign({}, a), (_a = {}, _a[c] = state[c], _a)));
            }, {});
        });
    if (typeof selector === "string")
        return useSelector(Context, function (state) { return state[selector]; });
    throw new Error("Invalid selector");
}
exports.useContextHook = useContextHook;
/**
 * @description use this instead of React.createContext
 * @returns {React.Context} a context with a Provider that has a value property that is a ref
 */
function createContextHook() {
    var context = (0, react_1.createContext)({
        value: { current: undefined },
        registerListener: function () { return function () { }; },
    });
    delete context.Consumer;
    context.Provider = createProvider(context.Provider);
    return context;
}
exports.createContextHook = createContextHook;
/**
 * Deep comparison between two values
 * @param {any} obj1 the first value
 * @param {any} obj2 the second value
 * @returns {boolean} true if obj1 and obj2 are deeply equal
 */
function deepCompare(obj1, obj2) {
    if (obj1 === void 0) { obj1 = ""; }
    if (obj2 === void 0) { obj2 = ""; }
    if (typeof obj1 != typeof obj2)
        return false;
    if (typeof obj1 != "object") {
        if (typeof obj1 == "function" && typeof obj2 == "function")
            return true;
        return obj1 == obj2;
    }
    //handle the null and undefined cases
    if (!obj1 || !obj2) {
        if (!obj1 && !obj2)
            return true;
        return obj1 == obj2;
    }
    if (Object.keys(obj1).length != Object.keys(obj2).length) {
        return false;
    }
    //deeply compare objects
    for (var key in obj1) {
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
function createProvider(ProviderOriginal) {
    return function (_a) {
        var value = _a.value, children = _a.children;
        var valueRef = (0, react_1.useRef)(value);
        var listenersRef = (0, react_1.useRef)(new Set());
        var contextValue = (0, react_1.useRef)({
            value: valueRef,
            registerListener: function (listener) {
                listenersRef.current.add(listener);
                return function () { return listenersRef.current.delete(listener); };
            },
        });
        useIsomorphicLayoutEffect(function () {
            listenersRef.current.forEach(function (listener) {
                listener(value, valueRef.current);
            });
            valueRef.current = value;
        }, [value]);
        return (react_1.default.createElement(ProviderOriginal, { value: contextValue.current }, children));
    };
}
/**
 * useSelector function
 * @param {React.Context} context The React Context to use
 * @param {Function} selector The function that will select a portion of the context's value
 * @returns {any} The selected portion of the context's value
 */
function useSelector(context, selector) {
    var _a = (0, react_1.useContext)(context), value = _a.value, registerListener = _a.registerListener;
    var _b = (0, react_1.useState)(function () {
        return selector(value.current);
    }), selectedValue = _b[0], setSelectedValue = _b[1];
    var selectorRef = (0, react_1.useRef)(selector);
    useIsomorphicLayoutEffect(function () {
        selectorRef.current = selector;
    }, [selector, selectorRef]);
    useIsomorphicLayoutEffect(function () {
        var updateValueIfNeeded = function (newValue, prevVal) {
            var newSelectedValue = selectorRef.current(newValue);
            var prevSelectedValue = selectorRef.current(prevVal);
            if (!deepCompare(newSelectedValue, prevSelectedValue)) {
                setSelectedValue(function () { return newSelectedValue; });
            }
        };
        var unregisterListener = registerListener(function (newValue, prevVal) {
            return updateValueIfNeeded(newValue, prevVal);
        });
        return unregisterListener;
    }, [registerListener, value]);
    return selectedValue;
}
/**
 * @deprecated use createContextHook instead
 * @description use this instead of React.createContext
 * @returns {React.Context} a context with a Provider that has a value property that is a ref
 */
exports.createContext = createContextHook;
/**
 * @deprecated use useContextHook instead
 * @param {React.Context} Context a context created with createContext from this package
 * @param {Function | Array | Object | string} selector a function or an array or an object or a string used to select the desired part of the context's value
 * @returns {any} the selected part of the context's value
 */
exports.useContextSelector = useContextHook;
//# sourceMappingURL=index.js.map