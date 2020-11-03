/* eslint-disable react/no-multi-comp, react/display-name */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import Nav from "../../../nav";
import Notifier from "../../../notifier";
import SessionTimeoutDialog from "../../../session-timeout-dialog";
import { hasUserPermissions } from "../../../user/selectors";
import DemoIndicator from "../../../demo-indicator";
import { useApp } from "../../../application";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ children }) => {
  const css = makeStyles(styles)();
  const { demo } = useApp();
  const hasPermissions = useSelector(state => hasUserPermissions(state));

  if (!hasPermissions) {
    return (
      <div className={css.loadingIndicator}>
        <CircularProgress size={80} />
      </div>
    );
  }

  return (
    <>
      <DemoIndicator isDemo={demo} />
      <div className={css.root}>
        <Notifier />
        <Nav />
        <SessionTimeoutDialog />
        <main className={css.content}>{children}</main>
      </div>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  children: PropTypes.node
};

export default Component;
