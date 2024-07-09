// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useSelector } from "react-redux";
import { createSelectorCreator, defaultMemoize } from "reselect";
import isNil from "lodash/isNil";
import omitBy from "lodash/omitBy";
import { useCallback } from "react";
import { memoize } from "proxy-memoize";

const selectorEqualityFn = (val1, val2) => {
  return val1 === val2;
};

const useMemoizedSelector = (selector, equalityFn) => {
  return useSelector(selector, equalityFn || selectorEqualityFn);
};

const createProxySelectorHook = () => {
  const useProxySelector = (fn, deps, equalityFn) => {
    return useMemoizedSelector(useCallback(memoize(fn), deps), equalityFn || selectorEqualityFn);
  };

  return useProxySelector;
};

export const cachedSelectorOptions = keySelector => {
  const defaultKeySelector = (_state, query) => JSON.stringify(omitBy(query, isNil));

  return {
    keySelector: keySelector || defaultKeySelector,
    selectorCreator: createSelectorCreator(defaultMemoize, selectorEqualityFn)
  };
};

export const useProxySelector = createProxySelectorHook();

export default useMemoizedSelector;

export { selectorEqualityFn };
