import React, { useRef, useImperativeHandle, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { object, string } from "yup";
import { withRouter, useLocation } from "react-router-dom";
import qs from "qs";
import { useForm, FormContext } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import {
  FieldRecord,
  FormSectionRecord,
  SELECT_FIELD,
  RADIO_FIELD,
  FORM_MODE_DIALOG,
  whichFormMode,
  TEXT_AREA,
  TEXT_FIELD,
  TICK_FIELD,
  TOGGLE_FIELD
} from "../../form";
import submitForm from "../../../libs/submit-form";
import { RECORD_TYPES } from "../../../config";
import { getFiltersValuesByRecordType } from "../../index-filters/selectors";
import { getRecords } from "../../index-table";
import { EXPORT_DIALOG } from "../constants";
import { getMetadata } from "../../record-list/selectors";
import FormSectionField from "../../form/components/form-section-field";
import { submitHandler } from "../../form/utils/form-submission";

import { NAME, ALL_EXPORT_TYPES, FIELD_ID, FORMS_ID } from "./constants";
import { formatFileName, exporterFilters } from "./utils";
import form from "./form";
import { saveExport } from "./action-creators";
import styles from "./styles.css";

const Component = ({
  openExportsDialog,
  close,
  recordType,
  userPermissions,
  match,
  record,
  currentPage,
  selectedRecords,
  pending,
  setPending
}) => {
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const formMode = whichFormMode("edit");
  const { params } = match;
  const css = makeStyles(styles)();
  const isShowPage = Object.keys(params).length > 0;
  const validationSchema = object().shape({
    export_type: string().required(i18n.t("encrypt.export_type")),
    password: string().required(i18n.t("encrypt.password_label"))
  });

  // TODO: Make constants
  const defaultValues = {
    export_type: "",
    custom_format_type: "",
    individual_fields: false,
    form_to_export: [],
    fields_to_export: [],
    password: "",
    custom_export_file_name: ""
  };

  const formMethods = useForm({
    ...(validationSchema && { validationSchema }),
    defaultValues
  });

  const formatType = formMethods.watch("custom_format_type");
  const individualFields = formMethods.watch("individual_fields");
  const isCustomExport = formMethods.watch("export_type") === "custom_exports";

  const records = useSelector(state => getRecords(state, recordType)).get(
    "data"
  );
  const metadata = useSelector(state => getMetadata(state, recordType));
  const totalRecords = metadata?.get("total", 0);
  const appliedFilters = useSelector(state =>
    getFiltersValuesByRecordType(state, recordType)
  );
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));

  const selectedRecordsLength = Object.values(selectedRecords || {}).flat()
    ?.length;

  const allCurrentRowsSelected =
    selectedRecordsLength > 0 &&
    records.size > 0 &&
    selectedRecordsLength === records.size;

  const allRecordsSelected = selectedRecordsLength === totalRecords;

  const handleSubmit = values => {
    const { id, format, message } = ALL_EXPORT_TYPES.find(
      e => e.id === values.export_type
    );
    const fileName = formatFileName(values.custom_export_file_name, format);
    const shortIds = records
      .toJS()
      .filter((_r, i) => selectedRecords?.[currentPage]?.includes(i))
      .map(r => r.short_id);

    const filters = exporterFilters(
      isShowPage,
      allCurrentRowsSelected,
      shortIds,
      appliedFilters,
      queryParams,
      record,
      allRecordsSelected
    );

    const body = {
      export_format: id,
      record_type: RECORD_TYPES[recordType],
      file_name: fileName,
      password: values.password
    };

    console.log("SUBMIT", values);

    const data = { ...body, ...filters };

    // setPending(true);

    // dispatch(
    //   saveExport(
    //     { data },
    //     i18n.t(message || "exports.queueing", {
    //       file_name: fileName ? `: ${fileName}.` : "."
    //     }),
    //     i18n.t("exports.go_to_exports"),
    //     EXPORT_DIALOG
    //   )
    // );
  };

  useEffect(() => {
    if (formatType === FIELD_ID) {
      formMethods.setValue("individual_fields", false);
      formMethods.setValue("form_to_export", []);
    }
  }, [formatType]);

  useImperativeHandle(
    formRef,
    submitHandler({
      dispatch,
      formMethods,
      formMode,
      i18n,
      initialValues: defaultValues,
      onSubmit: handleSubmit
    })
  );

  const formSections = form(
    i18n,
    userPermissions,
    isCustomExport,
    isShowPage,
    formatType,
    individualFields,
    css
  );

  return (
    <ActionDialog
      open={openExportsDialog}
      successHandler={() => submitForm(formRef)}
      dialogTitle={i18n.t("cases.export")}
      confirmButtonLabel={i18n.t("buttons.export")}
      onClose={close}
      omitCloseAfterSuccess
      cancelHandler={close}
      pending={pending}
      enabledSuccessButton={!isCustomExport || formatType !== ""}
    >
      <FormContext {...formMethods} formMode={formMode}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          {formSections.map(field => {
            return <FormSectionField field={field} />;
          })}
        </form>
      </FormContext>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  openExportsDialog: false
};

Component.propTypes = {
  close: PropTypes.func,
  currentPage: PropTypes.number,
  match: PropTypes.object,
  openExportsDialog: PropTypes.bool,
  pending: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.object,
  setPending: PropTypes.func,
  userPermissions: PropTypes.object
};

export default withRouter(Component);
