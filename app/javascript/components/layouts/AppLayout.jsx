import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { CircularProgress } from "@material-ui/core";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { Nav, selectDrawerOpen } from "../nav";
import { Notifier } from "../notifier";
import { SessionTimeoutDialog } from "../session-timeout-dialog";
import { hasUserPermissions } from "../user/selectors";

import styles from "./styles.css";

const AppLayout = ({ children }) => {
  const css = makeStyles(styles)();
  const hasPermissions = useSelector(state => hasUserPermissions(state));
  const drawerOpen = useSelector(state => selectDrawerOpen(state));

  if (!hasPermissions) {
    return (
      <div className={css.loadingIndicator}>
        <CircularProgress size={80} />
      </div>
    );
  }

  return (
    <div className={css.root}>
      <Notifier />
      <Nav />
      <SessionTimeoutDialog />
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

AppLayout.displayName = "AppLayout";

AppLayout.propTypes = {
  children: PropTypes.node
};

export default AppLayout;
