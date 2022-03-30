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

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ children }) => {
  const { demo } = useApp();

  const classes = clsx({ [css.root]: true });

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
        <main className={css.content}>{children}</main>
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
