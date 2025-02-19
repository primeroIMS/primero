// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import css from "./style.css";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useState } from "react";
import ActionDialog from "../../../../../components/action-dialog";
import Form from "../../../../../components/form";

import { NAME, FORM_ID } from "./constants";
import { form } from "./form";
import { saveExport } from "../../../../../components/record-actions/exports/action-creators";
import { formatFileName } from "../../../../../components/record-actions/exports/utils";


const Component = ({ close, i18n, open, pending, setPending }) => {
  const dispatch = useDispatch();
  const dialogPending = typeof pending === "object" ? pending.get("pending") : pending;
  const message = undefined;

  // Grouping useState variables together
  const [validationError, setValidationError] = useState("");

  // Form submission
  const onSubmit = getData => {
    // Check if any of the required fields are null
    if (!getData.From) {
      setValidationError(i18n.t("usage_report.from_date_required"));
    } else if (!getData.To) {
      setValidationError(i18n.t("usage_report.to_date_required"));
    } else if (!getData.file_name) {
      setValidationError(i18n.t("usage_report.filename_required"));
    } else if (getData.From > getData.To) {
      setValidationError(i18n.t("usage_report.to_smaller_than_from"));
    } else {
      const fileName = formatFileName(getData.file_name, "xlsx");
      const defaultBody = {
        export_format: "xlsx",
        record_type: "user",
        file_name: fileName,
        selected_from_date: getData.From,
        selected_to_date: getData.To
      };
      const data = { ...defaultBody };
      setValidationError("");
      dispatch(
        saveExport(
          { data },
          i18n.t(message || "exports.queueing", {
            file_name: fileName ? `: ${fileName}.` : "."
          }),
          i18n.t("exports.go_to_exports")
        ),
      );
    }
  };

  const handleCustomClose = () => {
    setValidationError("");
    close();
  };

  return (
    <ActionDialog
      open={open}
      confirmButtonProps={{
        form: FORM_ID,
        type: "submit"
      }}
      cancelHandler={handleCustomClose}
      dialogTitle={i18n.t("usage_report.label")}
      confirmButtonLabel={i18n.t("buttons.export")}
      pending={dialogPending}
      omitCloseAfterSuccess
    >
      <Form
        useCancelPrompt
        formID={FORM_ID}
        mode="new"
        formSections={form(i18n)}
        onSubmit={onSubmit}
      />
      {validationError === "" ? null : <p className={css.dateWarning}>{validationError}</p>}
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  i18n: PropTypes.object,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  setPending: PropTypes.func
};

export default Component;