// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp, react/display-name */
import clsx from "clsx";
import { CircularProgress } from "@material-ui/core";
import PropTypes from "prop-types";

import Nav from "../../../nav";
import Notifier from "../../../notifier";
import SessionTimeoutDialog from "../../../session-timeout-dialog";
import { hasUserPermissions } from "../../../user/selectors";
import DemoIndicator from "../../../demo-indicator";
import { useApp } from "../../../application";
import LoginDialog from "../../../login-dialog";
import { useMemoizedSelector } from "../../../../libs";
import usePushNotifications from "../../../push-notifications-toggle/use-push-notifications";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ children }) => {
  const { demo } = useApp();

  usePushNotifications();

  const classes = clsx({ [css.root]: true, [css.demo]: demo });
  const contentClasses = clsx({ [css.content]: true, [css.demo]: demo });

  const hasPermissions = useMemoizedSelector(state => hasUserPermissions(state));

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
      <div className={classes}>
        <Notifier />
        <Nav />
        <SessionTimeoutDialog />
        <main className={contentClasses}>{children}</main>
        <LoginDialog />
      </div>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  children: PropTypes.node
};

export default Component;
