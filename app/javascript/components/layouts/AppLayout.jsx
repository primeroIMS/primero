import React from "react";
import clsx from "clsx";
import { Nav, selectDrawerOpen } from "components/nav";
import { makeStyles, CssBaseline } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./styles.css";

const AppLayout = ({ children, drawerOpen }) => {
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
        {children}
      </main>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.object,
  drawerOpen: PropTypes.bool.isRequired,
  route: PropTypes.object
};

const mapStateToProps = state => ({
  drawerOpen: selectDrawerOpen(state)
});

export default connect(mapStateToProps)(AppLayout);
