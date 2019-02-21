import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { Nav } from "../components/nav";
import routes from "../routes";

const styles = theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    padding: 10
  }
});

export default withStyles(styles)(({ classes }) => {
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
});
