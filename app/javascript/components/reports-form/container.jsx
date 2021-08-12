/* eslint-disable camelcase */

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { push } from "connected-react-router";
import omit from "lodash/omit";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { useDialog } from "../action-dialog";
import { ROUTES, SAVE_METHODS } from "../../config";
import { useMemoizedSelector } from "../../libs";
import { useApp } from "../application";
import { getAgeRanges, getReportingLocationConfig } from "../application/selectors";
import Form, { FormAction, whichFormMode } from "../form";
import { useI18n } from "../i18n";
import LoadingIndicator from "../loading-indicator";
import PageContainer, { PageContent, PageHeading } from "../page";
import { getRecordForms } from "../record-form/selectors";
import { fetchReport } from "../report/action-creators";
import { getReport } from "../report/selectors";
import { NAME as TranslationsFormName } from "../translations-dialog/constants";
import TranslationsDialog from "../translations-dialog";
import { buildLocaleFields, localesToRender } from "../translations-dialog/utils";

import { clearSelectedReport, saveReport } from "./action-creators";
import ReportFilters from "./components/filters";
import {
  AGGREGATE_BY_FIELD,
  DISAGGREGATE_BY_FIELD,
  FILTERS_FIELD,
  FORM_ID,
  NAME,
  REPORT_FIELD_TYPES,
  SHARED_FILTERS,
  DATE
} from "./constants";
import { form, validations } from "./form";
import NAMESPACE from "./namespace";
import { buildMinimumReportableFields, buildReportFields, checkValue, formatAgeRange, formatReport } from "./utils";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const { dialogOpen, setDialog } = useDialog(TranslationsFormName);

  const i18n = useI18n();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { userModules } = useApp();

  const [selectedRecordType, setSelectedRecordType] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  const isEditOrShow = formMode.isEdit || formMode.isShow;

  const primeroAgeRanges = useMemoizedSelector(state => getAgeRanges(state));
  const report = useMemoizedSelector(state => getReport(state));
  const allRecordForms = useMemoizedSelector(state => getRecordForms(state, { all: true }));
  const reportingLocationConfig = useMemoizedSelector(state => getReportingLocationConfig(state));

  const registeredFields = [FILTERS_FIELD].concat(buildLocaleFields(localesToRender(i18n.applicationLocales)));

  const formattedMinimumReportableFields = buildMinimumReportableFields(i18n, allRecordForms);

  const [indexes, setIndexes] = useState(SHARED_FILTERS.map((data, index) => ({ index, data })));

  const initialValues = {
    ...formatReport(report.toJS()),
    ...(formMode.isNew ? { group_dates_by: DATE } : {})
  };

  useEffect(() => {
    if (isEditOrShow) {
      dispatch(fetchReport(id));
    }

    return () => {
      if (isEditOrShow) {
        dispatch(clearSelectedReport());
      }
    };
  }, [id]);

  useEffect(() => {
    if (report.size) {
      setIndexes(initialValues.filters.map((data, index) => ({ index, data })));
      setSelectedModule(report.get("module_id"));
      setSelectedRecordType(report.get("record_type"));
    }
    if (formMode.isNew) {
      setIndexes(SHARED_FILTERS.map((data, index) => ({ index, data })));
    }
  }, [report]);

  const onManageTranslations = () => setDialog({ dialog: TranslationsFormName, open: true });

  const onSubmit = data => {
    const { aggregate_by, disaggregate_by } = data;

    const fields = [
      ...buildReportFields(aggregate_by, REPORT_FIELD_TYPES.horizontal),
      ...buildReportFields(disaggregate_by, REPORT_FIELD_TYPES.vertical)
    ];

    const body = {
      data: {
        ...omit(data, [AGGREGATE_BY_FIELD, DISAGGREGATE_BY_FIELD]),
        ...(fields.length && { fields }),
        filters: indexes.map(({ data: filter }) => ({
          ...filter,
          value: checkValue(filter)
        }))
      }
    };

    dispatch(
      saveReport({
        id,
        saveMethod: formMode.isEdit ? SAVE_METHODS.update : SAVE_METHODS.new,
        body,
        message: formMode.isEdit ? i18n.t("report.messages.updated") : i18n.t("report.messages.success")
      })
    );
  };

  const formSections = form(
    i18n,
    formatAgeRange(primeroAgeRanges),
    formMode.isNew,
    userModules,
    reportingLocationConfig,
    formattedMinimumReportableFields,
    setSelectedRecordType,
    setSelectedModule
  );
  const validationSchema = validations(i18n);
  const handleCancel = () => {
    dispatch(push(ROUTES.reports));
  };

  const pageHeading =
    report?.size && !formMode.isNew ? report.getIn(["name", i18n.locale]) : i18n.t("reports.register_new_report");

  const saveButton = (formMode.isEdit || formMode.isNew) && (
    <>
      <FormAction actionHandler={onManageTranslations} text={i18n.t("reports.translations.manage")} />
      <FormAction cancel actionHandler={handleCancel} text={i18n.t("buttons.cancel")} startIcon={<ClearIcon />} />
      <FormAction
        text={i18n.t("buttons.save")}
        savingRecord={false}
        startIcon={<CheckIcon />}
        options={{
          form: FORM_ID,
          type: "submit"
        }}
      />
    </>
  );

  return (
    <LoadingIndicator hasData={formMode.isNew || report?.size > 0} loading={!report.isEmpty()} type={NAMESPACE}>
      <PageContainer>
        <PageHeading title={pageHeading}>{saveButton}</PageHeading>
        <PageContent>
          <Form
            initialValues={initialValues}
            formSections={formSections}
            onSubmit={onSubmit}
            formMode={formMode}
            validations={validationSchema}
            formID={FORM_ID}
            registerFields={registeredFields}
            submitAllFields
            submitAlways
            renderBottom={formMethods => (
              <>
                <ReportFilters
                  formMode={formMode}
                  allRecordForms={allRecordForms}
                  parentFormMethods={formMethods}
                  selectedReport={report}
                  indexes={indexes}
                  setIndexes={setIndexes}
                  reportingLocationConfig={reportingLocationConfig}
                  formattedMinimumReportableFields={formattedMinimumReportableFields}
                  selectedRecordType={selectedRecordType}
                  selectedModule={selectedModule}
                />
                {dialogOpen && (
                  <TranslationsDialog
                    dialogTitle={i18n.t("reports.translations.edit")}
                    formMethods={formMethods}
                    mode={mode}
                  />
                )}
              </>
            )}
          />
        </PageContent>
      </PageContainer>
    </LoadingIndicator>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  mode: PropTypes.string
};

export default Container;
