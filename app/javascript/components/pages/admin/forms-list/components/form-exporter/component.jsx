import React, { useRef } from "react";
import PropTypes from "prop-types";

import ActionDialog from "../../../../../action-dialog";
import bindFormSubmit from "../../../../../../libs/submit-form";
import Form from "../../../../../form";

import { NAME, EXPORT_TYPES } from "./constants";
import { form } from "./form";

const Component = ({ close, filters, i18n, open, pending }) => {
  const formRef = useRef();
  const { recordType, primeroModule } = filters;
  const dialogPending = typeof pending === "object" ? pending.get("pending") : pending;

  const onSubmit = data => {
    const body = {
      data: {
        ...data,
        export_type: EXPORT_TYPES.EXCEL,
        record_type: recordType,
        module_id: primeroModule
      }
    };

    console.log("SUBMIT", body);
  };

  return (
    <ActionDialog
      open={open}
      successHandler={() => bindFormSubmit(formRef)}
      cancelHandler={() => close()}
      dialogTitle={i18n.t("form_export.label")}
      confirmButtonLabel={i18n.t("buttons.export")}
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
  filters: PropTypes.object,
  i18n: PropTypes.object,
  open: PropTypes.bool,
  pending: PropTypes.bool
};

export default Component;
