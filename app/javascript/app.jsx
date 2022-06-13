import { ConnectedRouter } from "connected-react-router/immutable";
import { Provider } from "react-redux";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import I18nProvider from "./components/i18n";
import { ApplicationProvider } from "./components/application";
import { routes } from "./config";
import configureStore, { history } from "./store";
import ApplicationRoutes from "./components/application-routes";
import ThemeProvider from "./theme-provider";
import "mui-nepali-datepicker-reactjs/dist/index.css";
import { getAppResources } from "./components/user/action-creators";

const store = configureStore();

store.dispatch(getAppResources);

const App = () => {
  window.I18n.fallbacks = true;

  return (
    <Provider store={store}>
      <ThemeProvider>
        <I18nProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ApplicationProvider>
              <ConnectedRouter history={history}>
                <ApplicationRoutes routes={routes} />
              </ConnectedRouter>
            </ApplicationProvider>
          </MuiPickersUtilsProvider>
        </I18nProvider>
      </ThemeProvider>
    </Provider>
  );
};

App.displayName = "App";

export default App;
