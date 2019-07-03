import React, { useEffect } from "react";
import clsx from "clsx";
import { Route, Switch } from "react-router-dom";
import { Nav, selectDrawerOpen } from "components/nav";
import { makeStyles, CssBaseline } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { fetchForms, fetchOptions } from "components/record-form";
import styles from "./styles.css";

const AppLayout = ({ drawerOpen, route }) => {
  const css = makeStyles(styles)();
  const dispatch = useDispatch();

  useEffect(() => {
    // TODO: Will have to ensure user is signed in for forms
    dispatch(fetchForms());
    dispatch(fetchOptions());
  }, []);

  return (
    <div className={css.root}>
      <CssBaseline />
      <Nav />
      <main
        className={clsx(css.content, {
          [css.contentShift]: drawerOpen
        })}
      >
        <Switch>
          {route.routes.map(r => {
            const { path, component: Component, exact, ...rest } = r;

            return (
              <Route
                key={path}
                path={path}
                exact={exact}
                render={() => <Component {...rest} />}
              />
            );
          })}
        </Switch>
      </main>
    </div>
  );
};

AppLayout.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  route: PropTypes.object
};

const mapStateToProps = state => ({
  drawerOpen: selectDrawerOpen(state)
});

export default connect(mapStateToProps)(AppLayout);
