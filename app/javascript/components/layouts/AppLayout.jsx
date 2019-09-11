import React from "react";
import clsx from "clsx";
import { Nav, selectDrawerOpen } from "components/nav";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Notifier } from "components/notifier";
import styles from "./styles.css";

const AppLayout = ({ children, drawerOpen }) => {
  const css = makeStyles(styles)();

  return (
    <div className={css.root}>
      <Notifier />
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
  children: PropTypes.node,
  drawerOpen: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  drawerOpen: selectDrawerOpen(state)
});

export default connect(mapStateToProps)(AppLayout);
