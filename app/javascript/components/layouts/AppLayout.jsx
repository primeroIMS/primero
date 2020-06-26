import React from "react";
import { makeStyles } from "@material-ui/styles";
import { CircularProgress } from "@material-ui/core";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import Nav from "../nav";
import Notifier from "../notifier";
import SessionTimeoutDialog from "../session-timeout-dialog";
import { hasUserPermissions } from "../user/selectors";
import OfflineIndicator from "../offline-indicator/component";

import styles from "./styles.css";

const AppLayout = ({ children }) => {
  const css = makeStyles(styles)();
  const hasPermissions = useSelector(state => hasUserPermissions(state));

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
      <main className={css.content}>
        <OfflineIndicator />
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
