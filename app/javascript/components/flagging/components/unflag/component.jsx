import React, { useEffect } from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import PropTypes from "prop-types";
import { Formik, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Box } from "@material-ui/core";
import { object, string } from "yup";

import { useI18n } from "../../../i18n";
import { unFlag } from "../../action-creators";
import ActionDialog from "../../../action-dialog";
import {
  selectDialog,
  selectDialogPending
} from "../../../record-actions/selectors";
import { setDialog, setPending } from "../../../record-actions/action-creators";
import { FLAG_DIALOG } from "../../constants";

import { NAME, UNFLAG_DIALOG } from "./constants";

const initialFormikValues = {
  unflag_message: ""
};

const validationSchema = object().shape({
  unflag_message: string().required()
});

const Component = ({ flag }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const inputProps = {
    component: TextField,
    multiline: true,
    fullWidth: true,
    autoFocus: true,
    InputLabelProps: {
      shrink: true
    }
  };
  const openUnflagDialog = useSelector(state =>
    selectDialog(state, UNFLAG_DIALOG)
  );

  const dialogPending = useSelector(state => selectDialogPending(state));
  const setDialogPending = pending => {
    dispatch(setPending({ pending }));
  };

  useEffect(() => {
    if (openUnflagDialog) {
      setDialogPending(false);
      dispatch(setDialog({ dialog: FLAG_DIALOG, open: false }));
    }
  }, [openUnflagDialog]);

  if (!flag) {
    return null;
  }

  const onSubmit = data => {
    batch(() => {
      setDialogPending(true);
      dispatch(
        unFlag(
          flag.id,
          { data },
          i18n.t("flags.flag_deleted"),
          flag.record_type,
          flag.record_id
        )
      );
      dispatch(setDialog({ dialog: FLAG_DIALOG, open: true }));
    });
  };

  const onReset = (data, actions) => {
    actions.resetForm(initialFormikValues);
    dispatch(setDialog({ dialog: UNFLAG_DIALOG, open: false }));
    setDialogPending(false);
    dispatch(setDialog({ dialog: FLAG_DIALOG, open: true }));
  };

  const formProps = {
    initialValues: initialFormikValues,
    validationSchema,
    onSubmit,
    onReset,
    validateOnBlur: false,
    validateOnChange: false
  };

  return (
    <Formik {...formProps}>
      {({ handleSubmit, handleReset }) => (
        <>
          <ActionDialog
            open={openUnflagDialog}
            maxSize="sm"
            dialogTitle={i18n.t("flags.resolve_flag")}
            confirmButtonLabel={i18n.t("flags.resolve_button")}
            successHandler={handleSubmit}
            cancelHandler={handleReset}
            pending={dialogPending}
          >
            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <Box px={2}>
                <Field
                  name="unflag_message"
                  label={i18n.t("flags.resolve_reason")}
                  {...inputProps}
                />
              </Box>
            </form>
          </ActionDialog>
        </>
      )}
    </Formik>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  flag: PropTypes.object.isRequired
};

export default Component;
