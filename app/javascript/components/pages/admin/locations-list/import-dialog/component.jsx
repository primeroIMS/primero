import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import ActionDialog from "../../../../action-dialog";
import bindFormSubmit from "../../../../../libs/submit-form";
import Form from "../../../../form";
import { enqueueSnackbar } from "../../../../notifier";

import { clearImportErrors, importLocations } from "./action-creators";
import { getImportErrors } from "./selectors";
import { form } from "./form";
import { NAME } from "./constants";

const Component = ({ close, i18n, open, pending }) => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const dialogPending = typeof pending === "object" ? pending.get("pending") : pending;
  const importFailure = useSelector(state => getImportErrors(state));

  const onSubmit = data => {
    const body = {
      data: { file_name: data.data_file_name, data_base64: data.data_base64 }
    };
    const message = i18n.t("imports.csv_hxl_location.messages.success");

    dispatch(importLocations({ body, message }));
  };

  useEffect(() => {
    if (importFailure.size > 0) {
      const errorMessages = importFailure.map(error => error.get("message")).join(", ");

      dispatch(enqueueSnackbar(errorMessages, { type: "error" }));
    }

    return () => {
      if (importFailure.size > 0) {
        dispatch(clearImportErrors());
      }
    };
  }, [importFailure]);

  return (
    <ActionDialog
      open={open}
      successHandler={() => bindFormSubmit(formRef)}
      cancelHandler={() => close()}
      dialogTitle={i18n.t("location.import_title")}
      confirmButtonLabel={i18n.t("buttons.import")}
      pending={dialogPending}
      omitCloseAfterSuccess
    >
      <Form useCancelPrompt mode="new" formSections={form(i18n)} onSubmit={onSubmit} ref={formRef} />
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  i18n: PropTypes.object,
  open: PropTypes.bool,
  pending: PropTypes.bool
};

export default Component;
