import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { Brightness1 as Circle } from "@material-ui/icons";
import ErrorIcon from "@material-ui/icons/Error";
import CheckIcon from "@material-ui/icons/Check";
import SignalWifiOffIcon from "@material-ui/icons/SignalWifiOff";
import { makeStyles } from "@material-ui/core/styles";

import { theme } from "../../config";
import { snackVariantClasses } from "../../theme";

import AppRoute from "./app-route";

const ApplicationRoutes = ({ routes }) => {
  const classes = makeStyles(snackVariantClasses(theme))();

  const appRoutes = routes.map((route, index) => {
    const { routes: subRoutes, exact, path } = route;

    const routeProps = {
      key: path || index,
      path: subRoutes ? subRoutes.map(r => r.path) : path,
      exact: subRoutes ? routes.some(r => r.exact) : exact
    };

    return (
      <Route {...routeProps}>
        <AppRoute route={route} />
      </Route>
    );
  });

  return (
    <SnackbarProvider
      maxSnack={3}
      iconVariant={{
        success: <CheckIcon />,
        error: <ErrorIcon />,
        warning: <SignalWifiOffIcon />,
        info: <Circle />
      }}
      classes={{
        lessPadding: classes.lessPadding,
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info
      }}
    >
      <Switch>{appRoutes}</Switch>
    </SnackbarProvider>
  );
};

ApplicationRoutes.displayName = "ApplicationRoutes";

ApplicationRoutes.propTypes = {
  routes: PropTypes.array.isRequired
};

export default ApplicationRoutes;
