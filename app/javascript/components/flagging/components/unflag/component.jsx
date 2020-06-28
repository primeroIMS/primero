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
import { ResolvedFlagIcon } from "../../../../images/primero-icons";
import {
  selectDialog,
  selectDialogPending
} from "../../../record-actions/selectors";
import { setDialog, setPending } from "../../../record-actions/action-creators";
import { FormAction } from "../../../form";

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

  const openFieldDialog = useSelector(state =>
    selectDialog(state, `${UNFLAG_DIALOG}_${flag.id}`)
  );

  const dialogPending = useSelector(state => selectDialogPending(state));
  const setDialogPending = pending => {
    dispatch(setPending({ pending }));
  };

  useEffect(() => {
    dispatch(setPending(false));
  }, [Boolean(openFieldDialog)]);

  const handleDialog = () => {
    dispatch(setDialog({ dialog: `${UNFLAG_DIALOG}_${flag.id}`, open: true }));
  };

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
    });
  };

  const onReset = (data, actions) => {
    actions.resetForm(initialFormikValues);
    dispatch(setDialog({ dialog: `${UNFLAG_DIALOG}_${flag.id}`, open: false }));
    setDialogPending(false);
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
          <FormAction
            actionHandler={handleDialog}
            text={i18n.t("flags.resolve_button")}
            startIcon={<ResolvedFlagIcon fontSize="small" />}
          />
          <ActionDialog
            open={openFieldDialog}
            maxSize="sm"
            dialogTitle={i18n.t("flags.resolve_flag")}
            confirmButtonLabel={i18n.t("flags.resolve_button")}
            successHandler={handleSubmit}
            cancelHandler={handleReset}
            pending={dialogPending}
            omitCloseAfterSuccess
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
