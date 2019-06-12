import React from "react";
import { Login, selectModule, selectAgency } from "components/pages/login";
import { Grid, Box, CssBaseline } from "@material-ui/core";
import { ModuleLogo } from "components/module-logo";
import { AgencyLogo } from "components/agency-logo";
import { ListIcon } from "components/list-icon";
import { TranslationsToggle } from "components/translations-toggle";
import { NavLink } from "react-router-dom";
import { withI18n } from "libs";
import { makeStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styles from "./login-styles.css";

const LoginLayout = ({ primeroModule, agency, i18n }) => {
  const css = makeStyles(styles)();
  return (
    <div>
      <CssBaseline />
      <Box className={[css.primeroBackground, css[primeroModule]].join(" ")}>
        <div className={css.content}>
          <Grid item xs={8} className={css.loginHeader}>
            <ModuleLogo moduleLogo={primeroModule} white />
          </Grid>
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="stretch"
            spacing={5}
            className={css.loginContainer}
          >
            <Grid item xs={12} sm={6} md={6}>
              <Login />
            </Grid>
            <Grid item className={css.loginLogo} xs={12} sm={6} md={6}>
              <AgencyLogo agency={agency} />
            </Grid>
          </Grid>
        </div>
        <Grid container className={css.footer}>
          <Grid item xs={2}>
            <TranslationsToggle />
          </Grid>
          <Grid item xs={8} />
          <Grid item xs={2}>
            <NavLink
              to="/support"
              className={css.navLink}
              activeClassName={css.navActive}
              exact
            >
              <ListIcon icon="support" />
              <span>{i18n.t("navigation.support")}</span>
            </NavLink>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

LoginLayout.propTypes = {
  primeroModule: PropTypes.string,
  agency: PropTypes.string,
  i18n: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  primeroModule: selectModule(state),
  agency: selectAgency(state)
});

export default withI18n(
  connect(
    mapStateToProps,
    null
  )(LoginLayout)
);
