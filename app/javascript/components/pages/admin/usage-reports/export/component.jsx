// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { object, string, date } from "yup";
import { useEffect } from "react";

import ActionDialog from "../../../../action-dialog";
import Form from "../../../../form";
import { formatFileName } from "../../../../record-actions/exports/utils";
import { toServerDateFormat, useMemoizedSelector } from "../../../../../libs";
import { clearExportedUsageReport, fetchUsageExport } from "../action-creators";
import { getUsageReportExport } from "../selectors";

import { NAME, FORM_ID, EXPORTED_URL } from "./constants";
import { form } from "./form";
import css from "./style.css";

const validationSchema = object({
  fromDate: date()
    .transform(
      originalValue => (originalValue === "" ? null : originalValue) // transform empty string to null
    )
    .required("From Date is required")
    .typeError("From Date must be a valid date"),
  toDate: date()
    .transform(
      originalValue => (originalValue === "" ? null : originalValue) // transform empty string to null
    )
    .required("To Date is required")
    .typeError("To Date must be a valid date") // catch invalid date format
    .test({
      name: "is-after",
      message: "To Date must be greater than From Date",
      test: (value, context) => {
        const { fromDate } = context.parent;

        return !fromDate || !value || value > fromDate;
      }
    }),
  file_name: string().required("File name is required")
});

function Component({ close, i18n, open, pending, setPending }) {
  const exportedUsageReport = useMemoizedSelector(state => getUsageReportExport(state));

  const dispatch = useDispatch();
  const dialogPending = typeof pending === "object" ? pending.get("pending") : pending;

  // Form submission
  const onSubmit = getData => {
    const fileName = formatFileName(getData.file_name, "xlsx");
    const defaultBody = {
      export_format: "xlsx",
      record_type: "usage_report",
      file_name: fileName,
      selected_from_date: toServerDateFormat(getData.fromDate),
      selected_to_date: toServerDateFormat(getData.toDate)
    };
    const data = { ...defaultBody };

    setPending(true);
    dispatch(fetchUsageExport(data, i18n.t("exports.exported")));
  };

  const handleCustomClose = () => close();

  useEffect(() => {
    if (!exportedUsageReport.isEmpty() && exportedUsageReport.get(EXPORTED_URL)) {
      window.open(exportedUsageReport.get(EXPORTED_URL));
      dispatch(clearExportedUsageReport());
    }
  }, [exportedUsageReport.get(EXPORTED_URL, "")]);

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
        formClassName={`${css["usage-reports-form"]}`}
        validations={validationSchema}
      />
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  i18n: PropTypes.object,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  setPending: PropTypes.func
};

export default Component;
