/* eslint-disable react/no-multi-comp, react/display-name */
import React from "react";
import clsx from "clsx";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import Nav from "../../../nav";
import Notifier from "../../../notifier";
import SessionTimeoutDialog from "../../../session-timeout-dialog";
import { hasUserPermissions } from "../../../user/selectors";
import DemoIndicator from "../../../demo-indicator";
import { useApp } from "../../../application";
import LoginDialog from "../../../login-dialog";
import theme from "../../../../config/theme";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ children }) => {
  const css = makeStyles(styles)();
  const { demo } = useApp();
  const hasPermissions = useSelector(state => hasUserPermissions(state));
  const direction = useSelector(state => state.getIn(["ui", "I18n", "dir"]));
  const themeWithDirection = { ...theme, direction };

  if (!hasPermissions) {
    return (
      <div className={css.loadingIndicator}>
        <CircularProgress size={80} />
      </div>
    );
  }

  return (
    <ThemeProvider theme={themeWithDirection}>
      <DemoIndicator isDemo={demo} />
      <div className={clsx({ [css.root]: true, [css.demo]: demo })}>
        <Notifier />
        <Nav />
        <SessionTimeoutDialog />
        <main className={css.content}>{children}</main>
        <LoginDialog />
      </div>
    </ThemeProvider>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  children: PropTypes.node
};

export default Component;
