import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { Nav } from "components/nav";
import routes from "config/routes";
import styles from './styles.module.css'

const AppLayout = () => {
  return (
    <div className={styles.root}>
      <CssBaseline />
      <Nav />
      <main className={styles.content}>
        <Switch>
          {routes.map(route => (
            <Route key={route.path} {...route} />
          ))}
        </Switch>
      </main>
    </div>
  );
};

export default AppLayout;
