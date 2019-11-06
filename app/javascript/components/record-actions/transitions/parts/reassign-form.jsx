import React, { useEffect } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "formik-material-ui";
import { Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { RECORD_TYPES, USER_NAME_FIELD } from "../../../../config";
import {
  getUsersByTransitionType,
  getErrorsByTransitionType
} from "../selectors";
import { saveAssignedUser, fetchAssignUsers } from "../action-creators";
import styles from "../styles.css";
import { SearchableSelect } from "../../../searchable-select";
import { enqueueSnackbar } from "../../../notifier";
import { useI18n } from "../../../i18n";

const initialValues = { transitioned_to: "", notes: "" };

const ReassignForm = ({ handleClose, record, recordType }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const transitionType = "reassign";

  const firstUpdate = React.useRef(true);

  useEffect(() => {
    dispatch(fetchAssignUsers(RECORD_TYPES[recordType]));
  }, []);

  const users = useSelector(state =>
    getUsersByTransitionType(state, transitionType)
  );

  const hasErrors = useSelector(state =>
    getErrorsByTransitionType(state, transitionType)
  );

  const closeModal = () => {
    handleClose();
  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const messages = hasErrors
      .valueSeq()
      .map(e => i18n.t(e))
      .join(", ");
    if (messages !== "") {
      dispatch(enqueueSnackbar(messages, "error"));
    } else {
      closeModal();
    }
  }, [hasErrors]);

  const validationSchema = Yup.object().shape({
    transitioned_to: Yup.string().required(
      i18n.t("reassign.user_mandatory_label")
    )
  });

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
    options: users
      ? users.valueSeq().map(user => {
          const userName = user.get(USER_NAME_FIELD);
          return {
            value: userName.toLowerCase(),
            label: userName
          };
        })
      : []
  };

  const handleAssign = (values, { setSubmitting }) => {
    dispatch(
      saveAssignedUser(
        record.get("id"),
        { data: values },
        i18n.t("reassign.successfully")
      )
    );
    setSubmitting(false);
  };

  const formProps = {
    initialValues,
    validationSchema,
    onSubmit: handleAssign
  };

  return (
    <Formik {...formProps}>
      {({ handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Field
              name="transitioned_to"
              render={({ field, form, ...other }) => {
                return (
                  <>
                    <SearchableSelect
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
        );
      }}
    </Formik>
  );
};

ReassignForm.propTypes = {
  handleClose: PropTypes.func,
  record: PropTypes.object,
  formik: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default ReassignForm;
