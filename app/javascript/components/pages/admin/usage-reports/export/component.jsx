// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { object, date } from "yup";
import { useEffect } from "react";

import { useI18n } from "../../../../i18n";
import ActionDialog from "../../../../action-dialog";
import Form from "../../../../form";
import { formatFileName } from "../../../../record-actions/exports/utils";
import { toServerDateFormat, useMemoizedSelector } from "../../../../../libs";
import { clearExportedUsageReport, fetchUsageExport } from "../action-creators";
import { getUsageReportExport } from "../selectors";

import { NAME, FORM_ID, EXPORTED_URL } from "./constants";
import { form } from "./form";
import css from "./style.css";

function Component({ close, open, pending, setPending }) {
  const i18n = useI18n();
  const exportedUsageReport = useMemoizedSelector(state => getUsageReportExport(state));
  const dispatch = useDispatch();
  const dialogPending = typeof pending === "object" ? pending.get("pending") : pending;

  const fieldDisplayName = {
    fromDate: i18n.t("key_performance_indicators.date_range_dialog.from"),
    toDate: i18n.t("key_performance_indicators.date_range_dialog.to"),
    file_name: i18n.t("usage_report.file_name")
  };

  const validationSchema = object({
    fromDate: date()
      .nullable()
      .required(i18n.t("fields.required_field", { field: fieldDisplayName.fromDate }))
      .typeError(i18n.t("usage_report.invalid_date_format", { field: fieldDisplayName.fromDate })),
    toDate: date()
      .nullable()
      .required(i18n.t("fields.required_field", { field: fieldDisplayName.toDate }))
      .typeError(i18n.t("usage_report.invalid_date_format", { field: fieldDisplayName.toDate }))
      .test({
        name: "is-after",
        message: i18n.t("usage_report.invalid_date_range", {
          from: fieldDisplayName.fromDate,
          to: fieldDisplayName.toDate
        }),
        test: (value, context) => {
          const { fromDate } = context.parent;

          return !fromDate || !value || value > fromDate;
        }
      })
  });

  // Form submission
  const onSubmit = getData => {
    const fileName = formatFileName(getData.file_name, "xlsx");
    const defaultBody = {
      file_name: fileName,
      from: toServerDateFormat(getData.fromDate),
      to: toServerDateFormat(getData.toDate)
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
        formSections={form(fieldDisplayName)}
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
  open: PropTypes.bool,
  pending: PropTypes.bool,
  setPending: PropTypes.func
};

export default Component;
