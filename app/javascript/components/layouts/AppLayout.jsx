import React from "react";
import clsx from "clsx";
import { Route, Switch } from "react-router-dom";
import { Nav, selectDrawerOpen } from "components/nav";
import routes from "config/routes";
import { makeStyles, CssBaseline } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./styles.css";

const AppLayout = ({ drawerOpen }) => {
  const css = makeStyles(styles)();

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
          {routes.map(route => (
            <Route key={route.path} {...route} />
          ))}
        </Switch>
      </main>
    </div>
  );
};

AppLayout.propTypes = {
  drawerOpen: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  drawerOpen: selectDrawerOpen(state)
});

export default connect(mapStateToProps)(AppLayout);
