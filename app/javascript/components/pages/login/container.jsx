import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { ModuleLogo } from "components/module-logo";
import { AgencyLogo } from "components/agency-logo";
import { ListIcon } from "components/list-icon";
import { TranslationsToggle } from "components/translations-toggle";
import { NavLink } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { withI18n } from "libs";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import styles from "./styles.css";
import * as actions from "./action-creators";
import namespace from "./namespace";

const Login = ({ logo, i18n, setStyle, loginStyles, handleSubmit }) => {
  const css = makeStyles(styles)();

  // TODO: Need to pass agency and logo path from api
  useEffect(() => {
    setStyle({
      module: Object.prototype.hasOwnProperty.call(css, logo)
        ? logo
        : "primero",
      agency: "unicef"
    });
  }, []);

  return (
    <div>
      <CssBaseline />
      <Box className={[css.primeroBackground, css[loginStyles.module]]}>
        <div className={css.content}>
          <Grid item xs={8} className={css.loginHeader}>
            <ModuleLogo moduleLogo={loginStyles.module} />
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
                  autoComplete="email"
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
                  autoComplete="current-password"
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
              <AgencyLogo agency={loginStyles.agency} />
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
  logo: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired,
  loginStyles: PropTypes.object,
  setStyle: PropTypes.func,
  handleSubmit: PropTypes.func
};

const mapStateToProps = state => {
  return {
    loginStyles: state.get(namespace).toJS()
  };
};

const mapDispatchToProps = {
  setStyle: actions.setStyle,
  handleSubmit: actions.logIn
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
