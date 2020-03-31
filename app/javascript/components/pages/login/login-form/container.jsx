import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import { object, string } from "yup";

import { useI18n } from "../../../i18n";
import { enqueueSnackbar } from "../../../notifier";
import { PageHeading } from "../../../page";

import { NAME } from "./config";
import styles from "./styles.css";
import { attemptLogin } from "./action-creators";
import { selectAuthErrors } from "./selectors";

const validationSchema = object().shape({
  password: string().required(),
  user_name: string().required()
});

const Container = () => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const onSubmit = (values, { setSubmitting }) => {
    dispatch(attemptLogin(values));
    setSubmitting(false);
  };

  const authErrors = useSelector(state => selectAuthErrors(state));

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
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  authErrors: PropTypes.string,
  match: PropTypes.object
};

export default Container;
