import React, { useEffect } from "react";
import { Grid, Button, Link } from "@material-ui/core";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/styles";
import { connect, useDispatch } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import { enqueueSnackbar } from "components/notifier";
import { PageHeading } from "components/page-container";
import styles from "./styles.css";
import { attemptLogin, attemptSignout } from "./action-creators";
import * as Selectors from "./selectors";

const Login = ({ isAuthenticated, match, authErrors }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const onSubmit = (values, { setSubmitting }) => {
    dispatch(attemptLogin(values));
    setSubmitting(false);
  };

  useEffect(() => {
    dispatch(enqueueSnackbar(authErrors, "error"));
  }, [authErrors]);

  if (match.path.includes("signout")) {
    dispatch(attemptSignout());
    return <Redirect to="/login" />;
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const initialValues = {
    user_name: "",
    password: ""
  };

  const inputProps = {
    component: TextField,
    margin: "normal",
    required: true,
    fullWidth: true,
    InputLabelProps: {
      shrink: true
    },
    autoComplete: "off"
  };

  const formProps = {
    initialValues,
    onSubmit
  };

  // TODO: Need to pass agency and logo path from api
  // TODO: Add yup validations
  return (
    <>
      <PageHeading title={i18n.t("login.label")} />
      <Formik
        {...formProps}
        render={() => (
          <Form className={css.loginForm} autoComplete="off" noValidate>
            <Field
              name="user_name"
              label={i18n.t("login.username")}
              {...inputProps}
            />
            <Field
              name="password"
              label={i18n.t("login.password.label")}
              type="password"
              {...inputProps}
            />
            <Button type="submit" color="primary">
              {i18n.t("buttons.login")}
            </Button>
          </Form>
        )}
      />
      <Grid item xs className={css.recoveryLink}>
        <Link href="/forgot_password">{i18n.t("user.forgot_password")}</Link>
      </Grid>
    </>
  );
};

Login.propTypes = {
  isAuthenticated: PropTypes.bool,
  match: PropTypes.object,
  authErrors: PropTypes.string
};

const mapStateToProps = state => ({
  isAuthenticated: Selectors.selectAuthenticated(state),
  authErrors: Selectors.selectAuthErrors(state)
});

export default withRouter(connect(mapStateToProps)(Login));
