import React, { useEffect } from "react";
import { Grid, Button, Link } from "@material-ui/core";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import { enqueueSnackbar } from "components/notifier";
import { PageHeading } from "components/page";
import * as yup from "yup";
import styles from "./styles.css";
import { attemptLogin } from "./action-creators";
import * as Selectors from "./selectors";

const validationSchema = yup.object().shape({
  user_name: yup.string().required(),
  password: yup.string().required()
});

const Login = () => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const onSubmit = (values, { setSubmitting }) => {
    dispatch(attemptLogin(values));
    setSubmitting(false);
  };

  const authErrors = useSelector(state => Selectors.selectAuthErrors(state));

  useEffect(() => {
    dispatch(enqueueSnackbar(authErrors, "error"));
  }, [authErrors, dispatch]);

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
    validationSchema,
    initialValues,
    onSubmit,
    validateOnBlur: false,
    validateOnChange: false
  };

  // TODO: Need to pass agency and logo path from api
  return (
    <>
      <PageHeading title={i18n.t("login.label")} whiteHeading />
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
  match: PropTypes.object,
  authErrors: PropTypes.string
};

export default Login;
