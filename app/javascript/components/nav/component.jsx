import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  }
});

const nav = [
  { name: "Home", to: "/" },
  { name: "Cases", to: "/cases" },
  { name: "Incidents", to: "/incidents" }
];

export default withStyles(styles)(({ classes }) => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <List>
        {nav.map((l, i) => (
          <ListItem button component={Link} to={l.to} key={i}>
            <ListItemText primary={l.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
});
