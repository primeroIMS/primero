import React, { useEffect, useImperativeHandle, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { object, string, array } from "yup";
import { withRouter, useLocation } from "react-router-dom";
import qs from "qs";
import { useForm, FormContext } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import { whichFormMode } from "../../form";
import submitForm from "../../../libs/submit-form";
import { RECORD_TYPES } from "../../../config";
import { getFiltersValuesByRecordType } from "../../index-filters/selectors";
import { getRecords } from "../../index-table";
import { getMetadata } from "../../record-list/selectors";
import FormSectionField from "../../form/components/form-section-field";
import { submitHandler } from "../../form/utils/form-submission";
import { getRecordForms } from "../../record-form/selectors";
import { useApp } from "../../application";
import PdfExporter from "../../pdf-exporter";
import { getUser } from "../../user/selectors";
import { getAgencyLogos, getAgencyLogosPdf } from "../../application/selectors";

import {
  isCustomExport,
  isPdfExport,
  buildFields,
  exporterFilters,
  formatFileName,
  formatFields,
  exportFormsOptions
} from "./utils";
import {
  ALL_EXPORT_TYPES,
  CUSTOM_EXPORT_FILE_NAME_FIELD,
  CUSTOM_FORMAT_TYPE_FIELD,
  CUSTOM_HEADER,
  EXPORT_TYPE_FIELD,
  FIELDS_TO_EXPORT_FIELD,
  FIELD_ID,
  FORMS_ID,
  FORM_TO_EXPORT_FIELD,
  HEADER,
  INDIVIDUAL_FIELDS_FIELD,
  MODULE_FIELD,
  NAME,
  PASSWORD_FIELD
} from "./constants";
import form from "./form";
import { saveExport } from "./action-creators";

const Component = ({
  close,
  currentPage,
  match,
  open,
  pending,
  record,
  recordType,
  selectedRecords,
  setPending,
  userPermissions
}) => {
  const i18n = useI18n();
  const formRef = useRef();
  const pdfExporterRef = useRef();
  const dispatch = useDispatch();
  const formMode = whichFormMode("edit");
  const { params } = match;
  const isShowPage = Object.keys(params).length > 0;

  const validationSchema = object().shape({
    [EXPORT_TYPE_FIELD]: string().required(i18n.t("encrypt.export_type")),
    [FORM_TO_EXPORT_FIELD]: array().when(EXPORT_TYPE_FIELD, {
      is: value => isPdfExport(value),
      then: array().required(i18n.t("exports.custom_exports.forms"))
    }),
    [PASSWORD_FIELD]: string().when(EXPORT_TYPE_FIELD, {
      is: value => !isPdfExport(value),
      then: string().required(i18n.t("encrypt.password_label"))
    })
  });

  const defaultValues = {
    [EXPORT_TYPE_FIELD]: "",
    [MODULE_FIELD]: "",
    [CUSTOM_FORMAT_TYPE_FIELD]: "",
    [INDIVIDUAL_FIELDS_FIELD]: false,
    [FORM_TO_EXPORT_FIELD]: [],
    [FIELDS_TO_EXPORT_FIELD]: [],
    [PASSWORD_FIELD]: "",
    [CUSTOM_EXPORT_FILE_NAME_FIELD]: ""
  };
  const formMethods = useForm({
    ...(validationSchema && { validationSchema })
  });

  const records = useSelector(state => getRecords(state, recordType)).get("data");
  const metadata = useSelector(state => getMetadata(state, recordType));
  const appliedFilters = useSelector(state => getFiltersValuesByRecordType(state, recordType));

  const totalRecords = metadata?.get("total", 0);
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));
  const selectedRecordsLength = Object.values(selectedRecords || {}).flat()?.length;
  const allCurrentRowsSelected =
    selectedRecordsLength > 0 && records.size > 0 && selectedRecordsLength === records.size;
  const allRecordsSelected = selectedRecordsLength === totalRecords;
  const currentUser = useSelector(state => getUser(state, recordType));
  const agenciesWithLogosEnabled = useSelector(state => getAgencyLogos(state, true));
  const agencyLogosPdf = useSelector(state => getAgencyLogosPdf(state, true));

  const {
    [EXPORT_TYPE_FIELD]: exportType,
    [CUSTOM_FORMAT_TYPE_FIELD]: formatType,
    [INDIVIDUAL_FIELDS_FIELD]: individualFields,
    [FORM_TO_EXPORT_FIELD]: formsToExport,
    [FIELDS_TO_EXPORT_FIELD]: fieldsToExport,
    [MODULE_FIELD]: selectedModule
  } = formMethods.watch([
    MODULE_FIELD,
    FIELDS_TO_EXPORT_FIELD,
    FORM_TO_EXPORT_FIELD,
    EXPORT_TYPE_FIELD,
    CUSTOM_FORMAT_TYPE_FIELD,
    INDIVIDUAL_FIELDS_FIELD,
    CUSTOM_HEADER,
    HEADER
  ]);

  const { userModules } = useApp();
  const modules = userModules
    // eslint-disable-next-line camelcase
    .map(({ unique_id, name }) => ({
      id: unique_id,
      display_text: name
    }))
    .toJS();
  const recordTypesForms = useSelector(state =>
    getRecordForms(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule: selectedModule || record?.get("module_id")
    })
  );
  const fields = buildFields(recordTypesForms, i18n.locale, individualFields);

  const agencyLogo = {
    canShowImplemtationLogos: agenciesWithLogosEnabled?.size,
    canShowAgencyLogos: !isEmpty(currentUser.get("agencyLogo")),
    agencyLogosPdf
  };

  const handleSubmit = values => {
    if (isPdfExport(values[EXPORT_TYPE_FIELD])) {
      pdfExporterRef.current.savePdf({ setPending, close, values });

      return;
    }

    const { form_unique_ids: formUniqueIds, field_names: fieldNames } = values;
    const { id, format, message } = ALL_EXPORT_TYPES.find(e => e.id === values.export_type);
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

    const defaultBody = {
      export_format: id,
      record_type: RECORD_TYPES[recordType],
      file_name: fileName,
      password: values.password
    };

    let exportParams = {};

    if (!isEmpty(formUniqueIds)) {
      exportParams = {
        ...exportParams,
        [FORM_TO_EXPORT_FIELD]: formUniqueIds
      };
    }

    if (!isEmpty(fieldNames)) {
      exportParams = {
        ...exportParams,
        [FIELDS_TO_EXPORT_FIELD]: formatFields(fieldNames)
      };
    }

    // If we selected individual fields, we should pass forms and fields
    if (individualFields) {
      exportParams = {
        ...exportParams,
        [FORM_TO_EXPORT_FIELD]: uniq(
          fields.filter(field => fieldNames.includes(field.id)).map(field => field.formSectionId)
        )
      };
    }

    const body = isCustomExport
      ? {
          ...defaultBody,
          custom_export_params: exportParams
        }
      : defaultBody;

    const data = { ...body, ...filters };

    setPending(true);

    dispatch(
      saveExport(
        { data },
        i18n.t(message || "exports.queueing", {
          file_name: fileName ? `: ${fileName}.` : "."
        }),
        i18n.t("exports.go_to_exports")
      )
    );
  };

  useEffect(() => {
    if (isCustomExport && modules.length === 1) {
      formMethods.setValue(MODULE_FIELD, modules[0].id);
    }
  }, [exportType]);

  useEffect(() => {
    if (formatType === FIELD_ID) {
      formMethods.setValue(INDIVIDUAL_FIELDS_FIELD, false);
      formMethods.setValue(FORM_TO_EXPORT_FIELD, []);
    }
    if (formatType === FORMS_ID) {
      formMethods.setValue(FIELDS_TO_EXPORT_FIELD, []);
    }
  }, [formatType]);

  useEffect(() => {
    if (individualFields) {
      formMethods.setValue(FORM_TO_EXPORT_FIELD, []);
    }
  }, [individualFields]);

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
    isShowPage,
    modules,
    fields,
    exportFormsOptions(exportType, fields, recordTypesForms, i18n.locale),
    recordType,
    agencyLogo
  );

  const enabledSuccessButton =
    !isCustomExport(exportType) || (formatType !== "" && (!isEmpty(formsToExport) || !isEmpty(fieldsToExport)));

  return (
    <ActionDialog
      cancelHandler={close}
      confirmButtonLabel={i18n.t("buttons.export")}
      dialogTitle={i18n.t("cases.export")}
      enabledSuccessButton={enabledSuccessButton}
      omitCloseAfterSuccess
      onClose={close}
      open={open}
      pending={pending}
      successHandler={() => submitForm(formRef)}
    >
      <FormContext {...formMethods} formMode={formMode}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          {formSections.map(field => {
            return <FormSectionField field={field} key={field.unique_id} />;
          })}
        </form>
        {isPdfExport(exportType) && (
          <PdfExporter
            record={record}
            forms={recordTypesForms}
            ref={pdfExporterRef}
            formsSelectedField={FORM_TO_EXPORT_FIELD}
            customFilenameField={CUSTOM_EXPORT_FILE_NAME_FIELD}
            currentUser={currentUser}
            agenciesWithLogosEnabled={agenciesWithLogosEnabled}
            agencyLogosPdf={agencyLogosPdf}
          />
        )}
      </FormContext>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  open: false
};

Component.propTypes = {
  close: PropTypes.func,
  currentPage: PropTypes.number,
  match: PropTypes.object,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.object,
  setPending: PropTypes.func,
  userPermissions: PropTypes.object
};

export default withRouter(Component);
