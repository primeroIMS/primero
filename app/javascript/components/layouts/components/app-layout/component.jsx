/* eslint-disable react/no-multi-comp, react/display-name */
import clsx from "clsx";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import PropTypes from "prop-types";

import Nav from "../../../nav";
import Notifier from "../../../notifier";
import SessionTimeoutDialog from "../../../session-timeout-dialog";
import { hasUserPermissions } from "../../../user/selectors";
import DemoIndicator from "../../../demo-indicator";
import { useApp } from "../../../application";
import LoginDialog from "../../../login-dialog";
import { useMemoizedSelector, useThemeHelper } from "../../../../libs";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ children }) => {
  const css = makeStyles(styles)();
  const { demo } = useApp();
  const { theme } = useThemeHelper();

  const hasPermissions = useMemoizedSelector(state => hasUserPermissions(state));

  if (!hasPermissions) {
    return (
      <div className={css.loadingIndicator}>
        <CircularProgress size={80} />
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
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
