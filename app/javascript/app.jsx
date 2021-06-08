import { ConnectedRouter } from "connected-react-router/immutable";
import { Provider } from "react-redux";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import I18nProvider from "./components/i18n";
import { ApplicationProvider } from "./components/application";
import { routes } from "./config";
import NAMESPACE from "./components/i18n/namespace";
import { checkUserAuthentication } from "./components/user";
import { loginSystemSettings } from "./components/login";
import configureStore, { history } from "./store";
import ApplicationRoutes from "./components/application-routes";
import { fetchSandboxUI } from "./components/application/action-creators";

const store = configureStore();

const App = () => {
  store.subscribe(() => {
    const themeDir = store.getState().get("ui").get(NAMESPACE).get("dir");

    document.querySelector("html").setAttribute("dir", themeDir);
  });

  store.dispatch(fetchSandboxUI());
  store.dispatch(checkUserAuthentication());
  store.dispatch(loginSystemSettings());

  window.I18n.fallbacks = true;

  return (
    <Provider store={store}>
      <I18nProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ApplicationProvider>
            <ConnectedRouter history={history}>
              <ApplicationRoutes routes={routes} />
            </ConnectedRouter>
          </ApplicationProvider>
        </MuiPickersUtilsProvider>
      </I18nProvider>
    </Provider>
  );
};

App.displayName = "App";

export default App;
