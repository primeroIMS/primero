// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/prop-types, react/display-name */
import { fromJS } from "immutable";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";

import ThemeProvider from "../theme-provider";

import { createMockStore, DEFAULT_STATE } from "./create-mock-store";

function mountedThemeComponent(Component, state = DEFAULT_STATE) {
  const { store, history } = createMockStore(state, fromJS({}));

  const Providers = ({ children }) => {
    return (
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    );
  };

  const component = render(Component, {
    wrapper: Providers
  });

  return { ...component, store, history };
}

export default mountedThemeComponent;
