import React from "react";
import clsx from "clsx";
import { Route, Switch } from "react-router-dom";
import { Nav, selectDrawerOpen } from "components/nav";
import { makeStyles, CssBaseline } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./styles.css";

const AppLayout = ({ drawerOpen, route }) => {
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
          {route.routes.map(r => (
            <Route key={r.path} {...r} />
          ))}
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
