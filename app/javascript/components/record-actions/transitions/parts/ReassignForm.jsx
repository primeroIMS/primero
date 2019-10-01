import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Formik, Field, Form } from "formik";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "components/notifier";
import { TextField } from "formik-material-ui";
import { Box, Button } from "@material-ui/core";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/core/styles";
import { CustomAutoComplete } from "components/searchable-select";
import styles from "../styles.css";

const initialValues = { user: "", notes: "" };
const FormErrors = () => {
  const dispatch = useDispatch();
  const i18n = useI18n();

  useEffect(() => {
    dispatch(enqueueSnackbar(i18n.t("saved_search.no_filters"), "error"));
  }, [dispatch, i18n]);

  return null;
};

const ReassignForm = ({ users, handleClose }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const [formErrors, setFormErrors] = useState(false);

  const handleAssign = (values, actions) => {
    console.log("SAVE ACTION", values, actions);
  };

  const closeModal = () => {
    handleClose();
    setFormErrors(false);
  };

  const formProps = {
    initialValues,
    onSubmit: handleAssign
  };

  const inputProps = {
    component: TextField,
    label: i18n.t("reassign.notes_label"),
    fullWidth: true,
    InputLabelProps: {
      shrink: true
    }
  };

  const searchableSelectProps = {
    id: "userAutocomplete",
    TextFieldProps: {
      label: i18n.t("reassign.users_label"),
      InputLabelProps: {
        htmlFor: "userAutocomplete",
        shrink: true
      }
    },
    options: users
  };

  return (
    <Formik {...formProps}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            name="user"
            render={({ field, form, ...other }) => {
              return (
                <CustomAutoComplete
                  onChange={data => {
                    const { value } = data;
                    form.setFieldValue(field.name, value, false);
                  }}
                  {...searchableSelectProps}
                  {...other}
                />
              );
            }}
          />
          <br />
          <Field name="notes" {...inputProps} />
          {formErrors && <FormErrors />}
          <Box
            display="flex"
            my={3}
            justifyContent="flex-start"
            className={css.modalAction}
          >
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className={css.modalActionButton}
            >
              {i18n.t("buttons.save")}
            </Button>
            <Button onClick={closeModal} color="primary" variant="outlined">
              {i18n.t("buttons.cancel")}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

ReassignForm.propTypes = {
  users: PropTypes.array,
  handleClose: PropTypes.func
};

export default ReassignForm;
