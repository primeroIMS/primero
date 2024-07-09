// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import isFunction from "lodash/isFunction";
import { fromJS } from "immutable";

import I18nProvider from "../components/i18n/provider";

import { createMockStore, DEFAULT_STATE } from "./create-mock-store";

export const setupHook = (hook, state = {}) => {
  const { store } = createMockStore(DEFAULT_STATE, fromJS(state));

  if (!hook && !isFunction(hook)) {
    throw new Error("Hook function not specified");
  }

  const result = renderHook(() => hook(), {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <I18nProvider>{children}</I18nProvider>
      </Provider>
    )
  });

  return { ...result, store, act };
};

export default setupHook;
