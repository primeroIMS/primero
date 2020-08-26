import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import { object, string } from "yup";

import { useI18n } from "../../../i18n";
import { enqueueSnackbar } from "../../../notifier";
import { PageHeading } from "../../../page";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

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
    dispatch(enqueueSnackbar(authErrors, { type: "error" }));
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
            <Field id="user_name" name="user_name" label={i18n.t("login.username")} {...inputProps} />
            <Field
              id="password"
              name="password"
              label={i18n.t("login.password.label")}
              type="password"
              {...inputProps}
            />
            <ActionButton
              text={i18n.t("buttons.login")}
              type={ACTION_BUTTON_TYPES.default}
              rest={{
                "aria-label": i18n.t("buttons.login"),
                type: "submit"
              }}
            />
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
