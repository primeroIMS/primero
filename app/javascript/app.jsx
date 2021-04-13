import { ThemeProvider, createGenerateClassName, jssPreset, StylesProvider } from "@material-ui/core/styles";
import { ConnectedRouter } from "connected-react-router/immutable";
import CssBaseline from "@material-ui/core/CssBaseline";
import { create } from "jss";
import rtl from "jss-rtl";
import { Provider } from "react-redux";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";

import { theme, routes } from "./config";
import I18nProvider from "./components/i18n";
import NAMESPACE from "./components/i18n/namespace";
import { checkUserAuthentication } from "./components/user";
import { loginSystemSettings } from "./components/login";
import { ApplicationProvider } from "./components/application";
import configureStore, { history } from "./store";
import ApplicationRoutes from "./components/application-routes";
import CustomSnackbarProvider from "./components/custom-snackbar-provider";
import styles from "./styles.css";

const store = configureStore();

const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
  insertionPoint: document.getElementById("jss-insertion-point")
});

const generateClassName = createGenerateClassName();

const useStyles = makeStyles(styles);
const App = () => {
  const css = useStyles();

  store.subscribe(() => {
    const themeDir = store.getState().get("ui").get(NAMESPACE).get("dir");
    const isRTL = themeDir === "rtl";

    document.querySelector("body").setAttribute("dir", themeDir);
    document.querySelector("body").setAttribute("class", clsx({ [css.fontLTR]: isRTL }));
  });

  store.dispatch(checkUserAuthentication());
  store.dispatch(loginSystemSettings());

  window.I18n.fallbacks = true;

  return (
    <StylesProvider jss={jss} generateClassName={generateClassName}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <I18nProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <ApplicationProvider>
                <ConnectedRouter history={history}>
                  <CustomSnackbarProvider>
                    <ApplicationRoutes routes={routes} />
                  </CustomSnackbarProvider>
                </ConnectedRouter>
              </ApplicationProvider>
            </MuiPickersUtilsProvider>
          </I18nProvider>
        </Provider>
      </ThemeProvider>
    </StylesProvider>
  );
};

App.displayName = "App";

export default App;
