import React from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CssBaseline
} from "@material-ui/core";
import { ModuleLogo } from "components/module-logo";
import { AgencyLogo } from "components/agency-logo";
import { ListIcon } from "components/list-icon";
import { TranslationsToggle } from "components/translations-toggle";
import { NavLink } from "react-router-dom";
import { withI18n } from "libs";
import { makeStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styles from "./styles.css";
import * as Selectors from "./selectors";
import * as actions from "./action-creators";

const Login = ({ i18n, primeroModule, agency, handleSubmit }) => {
  const css = makeStyles(styles)();

  // TODO: Need to pass agency and logo path from api
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
              <form
                className={css.loginForm}
                onSubmit={handleSubmit}
                noValidate
              >
                <Typography component="h1">{i18n.t("login.label")}</Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={i18n.t("login.username")}
                  name="email"
                  helperText="Ex. primero@example.com"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label={i18n.t("login.password.label")}
                  type="password"
                  id="password"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <Button type="submit" variant="contained" color="primary">
                  {i18n.t("buttons.login")}
                </Button>
                <Grid item xs className={css.recoveryLink}>
                  <Link href="/forgot_password">
                    {i18n.t("user.forgot_password")}
                  </Link>
                </Grid>
              </form>
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

Login.propTypes = {
  i18n: PropTypes.object.isRequired,
  primeroModule: PropTypes.string,
  agency: PropTypes.string,
  handleSubmit: PropTypes.func
};

const mapStateToProps = state => ({
  primeroModule: Selectors.selectModule(state),
  agency: Selectors.selectAgency(state)
});

const mapDispatchToProps = {
  handleSubmit: actions.logIn
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
