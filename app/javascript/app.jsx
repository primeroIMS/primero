import { ConnectedRouter } from "connected-react-router/immutable";
import React from "react";
import { Provider } from "react-redux";
import Layout from "./containers/layout";
import configureStore, { history } from "./store";

const store = configureStore();

export default () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Layout />
      </ConnectedRouter>
    </Provider>
  );
};
