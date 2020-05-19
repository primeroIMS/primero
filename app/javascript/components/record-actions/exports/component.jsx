import React, { useEffect, useImperativeHandle, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { object, string } from "yup";
import { withRouter, useLocation } from "react-router-dom";
import qs from "qs";
import { useForm, FormContext } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import { whichFormMode } from "../../form";
import submitForm from "../../../libs/submit-form";
import { RECORD_TYPES } from "../../../config";
import { getFiltersValuesByRecordType } from "../../index-filters/selectors";
import { getRecords } from "../../index-table";
import { EXPORT_DIALOG } from "../constants";
import { getMetadata } from "../../record-list/selectors";
import FormSectionField from "../../form/components/form-section-field";
import { submitHandler } from "../../form/utils/form-submission";
import { getRecordForms } from "../../record-form/selectors";

import {
  ALL_EXPORT_TYPES,
  CUSTOM_EXPORT_FILE_NAME_FIELD,
  CUSTOM_FORMAT_TYPE_FIELD,
  EXPORT_TYPE_FIELD,
  FIELDS_TO_EXPORT_FIELD,
  FIELD_ID,
  FORMS_ID,
  FORM_TO_EXPORT_FIELD,
  INDIVIDUAL_FIELDS_FIELD,
  NAME,
  PASSWORD_FIELD
} from "./constants";
import { buildFields, exporterFilters, formatFileName } from "./utils";
import form from "./form";
import { saveExport } from "./action-creators";
import styles from "./styles.css";

const Component = ({
  close,
  currentPage,
  match,
  openExportsDialog,
  pending,
  record,
  recordType,
  selectedRecords,
  setPending,
  userPermissions
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

  const defaultValues = {
    [EXPORT_TYPE_FIELD]: "",
    [CUSTOM_FORMAT_TYPE_FIELD]: "",
    [INDIVIDUAL_FIELDS_FIELD]: false,
    [FORM_TO_EXPORT_FIELD]: [],
    [FIELDS_TO_EXPORT_FIELD]: [],
    [PASSWORD_FIELD]: "",
    [CUSTOM_EXPORT_FILE_NAME_FIELD]: ""
  };

  const formMethods = useForm({
    ...(validationSchema && { validationSchema }),
    defaultValues
  });

  const records = useSelector(state => getRecords(state, recordType)).get(
    "data"
  );
  const metadata = useSelector(state => getMetadata(state, recordType));
  const appliedFilters = useSelector(state =>
    getFiltersValuesByRecordType(state, recordType)
  );

  const totalRecords = metadata?.get("total", 0);
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));
  const selectedRecordsLength = Object.values(selectedRecords || {}).flat()
    ?.length;
  const allCurrentRowsSelected =
    selectedRecordsLength > 0 &&
    records.size > 0 &&
    selectedRecordsLength === records.size;
  const allRecordsSelected = selectedRecordsLength === totalRecords;

  const formatType = formMethods.watch(CUSTOM_FORMAT_TYPE_FIELD);
  const individualFields = formMethods.watch(INDIVIDUAL_FIELDS_FIELD);
  const isCustomExport =
    formMethods.watch(EXPORT_TYPE_FIELD) === "custom_exports";
  const recordTypesForms = useSelector(state =>
    getRecordForms(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule: record?.get("module_id")
    })
  );
  const fields = buildFields(recordTypesForms, i18n.locale);

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

    const data = { ...body, ...filters };

    setPending(true);

    dispatch(
      saveExport(
        { data },
        i18n.t(message || "exports.queueing", {
          file_name: fileName ? `: ${fileName}.` : "."
        }),
        i18n.t("exports.go_to_exports"),
        EXPORT_DIALOG
      )
    );
  };

  useEffect(() => {
    if (formatType === FIELD_ID) {
      formMethods.setValue(INDIVIDUAL_FIELDS_FIELD, false);
      formMethods.setValue(FORM_TO_EXPORT_FIELD, []);
    }
    if (formatType === FORMS_ID) {
      formMethods.setValue(FIELDS_TO_EXPORT_FIELD, []);
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
    css,
    fields
  );

  return (
    <ActionDialog
      cancelHandler={close}
      confirmButtonLabel={i18n.t("buttons.export")}
      dialogTitle={i18n.t("cases.export")}
      enabledSuccessButton={!isCustomExport || formatType !== ""}
      omitCloseAfterSuccess
      onClose={close}
      open={openExportsDialog}
      pending={pending}
      successHandler={() => submitForm(formRef)}
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
