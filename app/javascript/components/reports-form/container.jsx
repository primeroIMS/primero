/* eslint-disable camelcase */

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { push } from "connected-react-router";
import omit from "lodash/omit";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { ROUTES, SAVE_METHODS } from "../../config";
import { useMemoizedSelector } from "../../libs";
import { useApp } from "../application";
import { getAgeRanges } from "../application/selectors";
import Form, { FormAction, whichFormMode } from "../form";
import { useI18n } from "../i18n";
import LoadingIndicator from "../loading-indicator";
import PageContainer, { PageContent, PageHeading } from "../page";
import { getRecordForms } from "../record-form/selectors";
import { fetchReport } from "../report/action-creators";
import { getReport } from "../report/selectors";

import { clearSelectedReport, saveReport } from "./action-creators";
import ReportFilters from "./components/filters";
import {
  AGGREGATE_BY_FIELD,
  DEFAULT_FILTERS,
  DISAGGREGATE_BY_FIELD,
  FILTERS_FIELD,
  FORM_ID,
  NAME,
  REPORT_FIELD_TYPES
} from "./constants";
import { form, validations } from "./form";
import NAMESPACE from "./namespace";
import { buildReportFields, checkValue, formatAgeRange, formatReport } from "./utils";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);

  const i18n = useI18n();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { userModules } = useApp();

  const isEditOrShow = formMode.isEdit || formMode.isShow;

  const primeroAgeRanges = useMemoizedSelector(state => getAgeRanges(state));
  const report = useMemoizedSelector(state => getReport(state));
  const allRecordForms = useSelector(state => getRecordForms(state, { all: true }));

  const [indexes, setIndexes] = useState(DEFAULT_FILTERS.map((data, index) => ({ index, data })));

  const initialValues = {
    ...formatReport(report.toJS())
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
    }
    if (formMode.isNew) {
      setIndexes(DEFAULT_FILTERS.map((data, index) => ({ index, data })));
    }
  }, [report]);

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

  const formSections = form(i18n, formatAgeRange(primeroAgeRanges), formMode.isNew, userModules);
  const validationSchema = validations(i18n);
  const handleCancel = () => {
    dispatch(push(ROUTES.reports));
  };

  const pageHeading =
    report?.size && !formMode.isNew ? report.getIn(["name", i18n.locale]) : i18n.t("reports.register_new_report");

  const saveButton = (formMode.isEdit || formMode.isNew) && (
    <>
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
            registerFields={[FILTERS_FIELD]}
            submitAllFields
            renderBottom={formMethods => (
              <ReportFilters
                allRecordForms={allRecordForms}
                parentFormMethods={formMethods}
                selectedReport={report}
                indexes={indexes}
                setIndexes={setIndexes}
              />
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
