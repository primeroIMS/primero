import React from "react";
import { Grid, TextField, Button, Typography, Link } from "@material-ui/core";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const Login = ({ logIn, isAuthenticated, match }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const handleSubmit = (e) => {
    e.preventDefault();
    logIn(true);
  };

  if (match.path.includes("signout")) {
    logIn(false);
    return <Redirect to="/login" />
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />
  }

  // TODO: Need to pass agency and logo path from api
  return (
    <>
      <form className={css.loginForm} onSubmit={handleSubmit} noValidate>
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
          autoComplete="off"
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
          autoComplete="off"
        />
        <Button type="submit" color="primary">
          {i18n.t("buttons.login")}
        </Button>
        <Grid item xs className={css.recoveryLink}>
          <Link href="/forgot_password">{i18n.t("user.forgot_password")}</Link>
        </Grid>
      </form>
    </>
  );
};

Login.propTypes = {
  props: PropTypes.object,
  logIn: PropTypes.func,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: Selectors.selectAuthenticated(state)
});

const mapDispatchToProps = {
  logIn: actions.logIn
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
