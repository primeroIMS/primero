import { useSelector } from "react-redux";
import { createSelectorCreator, defaultMemoize } from "reselect";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import omitBy from "lodash/omitBy";

export const cachedSelectorOptions = keySelector => {
  const defaultKeySelector = (_state, query) => JSON.stringify(omitBy(query, isNil));

  return {
    keySelector: keySelector || defaultKeySelector,
    selectorCreator: createSelectorCreator(defaultMemoize, isEqual)
  };
};

export default (selector, equalityFn = isEqual) => {
  return useSelector(selector, equalityFn);
};
