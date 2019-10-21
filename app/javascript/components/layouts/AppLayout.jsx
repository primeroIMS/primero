import React from "react";
import clsx from "clsx";
import { Nav, selectDrawerOpen } from "components/nav";
import { makeStyles } from "@material-ui/styles";
import { CircularProgress } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import { Notifier } from "components/notifier";
import { SessionTimeoutDialog } from "components/session-timeout-dialog";
import { getAppSettingsFetched } from "components/application/selectors";
import styles from "./styles.css";

const AppLayout = ({ children, drawerOpen }) => {
  const css = makeStyles(styles)();
  const appSettingsFetched = useSelector(state => getAppSettingsFetched(state));

  return appSettingsFetched ? (
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
  ) : (
    <div className={css.loadingIndicator}>
      <CircularProgress size={80} />
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
