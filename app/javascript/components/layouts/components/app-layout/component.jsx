/* eslint-disable react/no-multi-comp, react/display-name */
import { cx } from "@emotion/css";
import { CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import { useRouteMatch } from "react-router-dom";

import Nav from "../../../nav";
import Notifier from "../../../notifier";
import SessionTimeoutDialog from "../../../session-timeout-dialog";
import { hasUserPermissions } from "../../../user/selectors";
import DemoIndicator from "../../../demo-indicator";
import { useApp } from "../../../application";
import LoginDialog from "../../../login-dialog";
import { useMemoizedSelector } from "../../../../libs";
import usePushNotifications from "../../../push-notifications-toggle/use-push-notifications";
import { ROUTES } from "../../../../config";

import { NAME } from "./constants";
import css from "./styles.css";

function Component({ children }) {
  const { demo } = useApp();
  const intakeRoute = useRouteMatch(ROUTES.intake_new);
  const intakeThankYouRoute = useRouteMatch(ROUTES.intake_thankyou);

  usePushNotifications();

  const classes = cx({ [css.root]: true, [css.demo]: demo });
  const contentClasses = cx({ [css.content]: true, [css.demo]: demo });

  const hasPermissions = useMemoizedSelector(state => hasUserPermissions(state));

  if (!hasPermissions && !(intakeRoute || intakeThankYouRoute)) {
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
        {!intakeRoute && <SessionTimeoutDialog />}
        <main className={contentClasses}>{children}</main>
        <LoginDialog />
      </div>
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  children: PropTypes.node
};

export default Component;
