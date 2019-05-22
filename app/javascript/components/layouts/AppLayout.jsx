import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import clsx from "clsx";
import { Route, Switch } from "react-router-dom";
import { Nav, namespace } from "components/nav";
import routes from "config/routes";
import "./global.css";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./styles.jss";

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

const mapStateToProps = state => {
  return {
    drawerOpen: state.get(namespace).toJS().drawerOpen
  };
};

export default connect(mapStateToProps)(AppLayout);
