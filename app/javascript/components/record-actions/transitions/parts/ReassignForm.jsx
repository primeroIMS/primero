import React from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { TextField } from "formik-material-ui";
import { Box, Button } from "@material-ui/core";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/core/styles";
import { CustomAutoComplete } from "components/searchable-select";
import { saveAssignedUser } from "../action-creators";
import { getAssignUsers } from "../selectors";
import styles from "../styles.css";

const initialValues = { transitioned_to: "", notes: "" };

const ReassignForm = ({ handleClose, record }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const css = makeStyles(styles)();

  const users = useSelector(state => getAssignUsers(state));

  const closeModal = () => {
    handleClose();
  };

  const handleAssign = (values, actions) => {
    dispatch(
      saveAssignedUser(
        record.get("id"),
        { data: values },
        i18n.t("reassign.successfully")
      )
    );
    actions.resetForm(initialValues);
    closeModal();
  };

  const validationSchema = Yup.object().shape({
    transitioned_to: Yup.string().required(
      i18n.t("reassign.user_mandatory_label")
    )
  });

  const formProps = {
    initialValues,
    validationSchema,
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
    id: "transitioned_to",
    name: "transitioned_to",
    TextFieldProps: {
      label: i18n.t("reassign.users_label"),
      InputLabelProps: {
        htmlFor: "transitioned_to",
        shrink: true
      }
    },
    options:
      users &&
      users.map(user => ({
        value: user.user_name.toLowerCase(),
        label: user.user_name
      }))
  };

  return (
    <Formik {...formProps}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            name="transitioned_to"
            render={({ field, form, ...other }) => {
              return (
                <>
                  <CustomAutoComplete
                    onChange={data => {
                      const { value } = data;
                      form.setFieldValue(field.name, value, false);
                    }}
                    {...searchableSelectProps}
                    {...other}
                    onBlur={field.onBlur}
                  />
                  {form.touched[field.name] && form.errors[field.name] && (
                    <div className="MuiFormHelperText-root Mui-error">
                      {form.errors[field.name]}
                    </div>
                  )}
                </>
              );
            }}
          />
          <br />
          <Field name="notes" {...inputProps} />
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
  handleClose: PropTypes.func,
  record: PropTypes.object
};

export default ReassignForm;
