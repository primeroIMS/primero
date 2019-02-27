import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { Nav } from "../components/nav";
import routes from "../config/routes";

const styles = {
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    padding: 10
  }
};

const Layout = ({ classes }) => {
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Nav />
      <div className={classes.content}>
        <Switch>
          {routes.map((route, i) => (
            <Route key={i} {...route} />
          ))}
        </Switch>
      </div>
    </div>
  );
};

export default withStyles(styles)(Layout);
