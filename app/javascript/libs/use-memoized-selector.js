// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useSelector } from "react-redux";
import { createSelectorCreator, lruMemoize } from "reselect";
import isNil from "lodash/isNil";
import omitBy from "lodash/omitBy";
import { useCallback } from "react";
import { memoize } from "proxy-memoize";
import Immutable from "immutable";
import isEqual from "lodash/isEqual";

const selectorEqualityFn = (val1, val2) => {
  if (Immutable.isImmutable(val1) && Immutable.isImmutable(val2)) {
    return Immutable.is(val1, val2);
  }

  return isEqual(val1, val2)
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
    selectorCreator: createSelectorCreator(lruMemoize, selectorEqualityFn)
  };
};

export const useProxySelector = createProxySelectorHook();

export default useMemoizedSelector;

export { selectorEqualityFn };
