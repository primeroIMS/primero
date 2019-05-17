import React from "react";
import { createMount } from "@material-ui/core/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { I18nProvider } from "libs";

export const setupMountedComponent = (
  TestComponent,
  props = {},
  initialState = {}
) => {
  const mockStore = configureStore();
  const store = mockStore(initialState);
  const component = createMount()(
    <Provider store={store}>
      <I18nProvider>
        <MemoryRouter>
          <TestComponent {...props} />
        </MemoryRouter>
      </I18nProvider>
    </Provider>
  );

  return {
    component
  };
};
