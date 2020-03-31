import React from "react";
import { Grid, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";

import { ModuleLogo } from "../module-logo";
import { AgencyLogo } from "../agency-logo";
import { TranslationsToggle } from "../translations-toggle";
import { useI18n } from "../i18n";
import { Notifier } from "../notifier";
import { useApp } from "../application";
import OfflineIndicator from "../offline-indicator";

import styles from "./login-styles.css";

const LoginLayout = ({ children }) => {
  const css = makeStyles(styles)();

  // TODO: Module hardcoded till we figure out when to switch modules
  const primeroModule = "cp";

  return (
    <>
      <Notifier />
      <OfflineIndicator />
      <Box className={[css.primeroBackground, css[primeroModule]].join(" ")}>
        <div className={css.content}>
          <div className={css.loginHeader}>
            <ModuleLogo moduleLogo={primeroModule} white />
          </div>
          <div className={css.authContainer}>
            <div className={css.auth}>
              <div className={css.formContainer}>
                <div className={css.form}>{children}</div>
              </div>
              <div className={css.loginLogo}>
                <AgencyLogo alwaysFullLogo />
              </div>
            </div>
          </div>
        </div>
        <Grid container className={css.footer}>
          <Grid item xs={2}>
            <TranslationsToggle />
          </Grid>
          <Grid item xs={8} />
          {/* <Grid item xs={2}>
            <NavLink
              to="/support"
              className={css.navLink}
              activeClassName={css.navActive}
              exact
            >
              <ListIcon icon="support" />
              <span>{i18n.t("navigation.support")}</span>
            </NavLink>
          </Grid> */}
        </Grid>
      </Box>
    </>
  );
};

LoginLayout.displayName = "LoginLayout";

LoginLayout.propTypes = {
  children: PropTypes.node
};

export default LoginLayout;
