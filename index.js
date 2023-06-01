"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContext = createContext;
exports.useContextSelector = useContextSelector;
var _react = require("react");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * @description use this instead of React.useContext
 * @param {*} Context a context created with createContext from this package
 * @param {*} selector | ["key","key","key"] || {key:1,key:,key:1} || (state)=>({ key1:state.key}) || (state)=>state.key
 * @returns
 */
function useContextSelector(Context, selector) {
  if (typeof selector === "function") return useSelector(Context, selector);
  if (Array.isArray(selector)) return useSelector(Context, function (_) {
    return selector.reduce(function (a, c) {
      return _objectSpread(_objectSpread({}, a), {}, _defineProperty({}, c, _[c]));
    }, {});
  });
  if (_typeof(selector) === "object") return useSelector(Context, function (_) {
    return Object.keys(selector).filter(function (_) {
      return selector[_];
    }).reduce(function (a, c) {
      return _objectSpread(_objectSpread({}, a), {}, _defineProperty({}, c, _[c]));
    }, {});
  });
}

/**
 * @description use this instead of React.createContext
 * @returns a context with a Provider that has a value property that is a ref
 */
function createContext() {
  var context = /*#__PURE__*/(0, _react.createContext)();
  delete context.Consumer;
  context.Provider = createProvider(context.Provider);
  return context;
}
function createProvider(ProviderOriginal) {
  return function (_ref) {
    var value = _ref.value,
      children = _ref.children;
    var valueRef = (0, _react.useRef)(value);
    var listenersRef = (0, _react.useRef)(new Set());
    var contextValue = (0, _react.useRef)({
      value: valueRef,
      registerListener: function registerListener(listener) {
        listenersRef.current.add(listener);
        return function () {
          return listenersRef.current["delete"](listener);
        };
      },
      listeners: new Set()
    });
    (0, _react.useEffect)(function () {
      listenersRef.current.forEach(function (listener) {
        listener(value, valueRef.current);
      });
      valueRef.current = value;
    }, [value]);
    return /*#__PURE__*/React.createElement(ProviderOriginal, {
      value: contextValue.current
    }, children);
  };
}
function useSelector(context, selector) {
  var _useContext = (0, _react.useContext)(context),
    value = _useContext.value,
    registerListener = _useContext.registerListener;
  var _useState = (0, _react.useState)(function () {
      return selector(value.current);
    }),
    _useState2 = _slicedToArray(_useState, 2),
    selectedValue = _useState2[0],
    setSelectedValue = _useState2[1];
  var selectorRef = (0, _react.useRef)(selector);
  (0, _react.useEffect)(function () {
    selectorRef.current = selector;
  }, [selector, selectorRef]);
  (0, _react.useEffect)(function () {
    var updateValueIfNeeded = function updateValueIfNeeded(newValue, prevVal) {
      var newS = selectorRef.current(newValue);
      var prevS = selectorRef.current(prevVal);
      if (JSON.stringify(newS) !== JSON.stringify(prevS)) setSelectedValue(function () {
        return newS;
      });
    };
    var unregisterListener = registerListener(function (_, prevVal) {
      return updateValueIfNeeded(_, prevVal);
    });
    return unregisterListener;
  }, [registerListener, value]);
  return selectedValue;
}
