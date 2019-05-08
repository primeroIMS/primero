import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { Nav } from "components/nav";
import routes from "config/routes";
import "./global.css";
import styles from "./styles.module.css";

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
