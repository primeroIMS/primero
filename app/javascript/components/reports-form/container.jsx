/* eslint-disable camelcase */

import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useParams } from "react-router-dom";
import omit from "lodash/omit";
import { FormContext, useForm } from "react-hook-form";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { useI18n } from "../i18n";
import LoadingIndicator from "../loading-indicator";
import { FormAction, FormSection, whichFormMode } from "../form";
import { fetchReport } from "../report/action-creators";
import { getReport } from "../report/selectors";
import PageContainer, { PageContent, PageHeading } from "../page";
import bindFormSubmit from "../../libs/submit-form";
import { ROUTES, SAVE_METHODS } from "../../config";
import { getAgeRanges } from "../application/selectors";
import { getRecordForms } from "../record-form/selectors";

import {
  NAME,
  AGGREGATE_BY_FIELD,
  DISAGGREGATE_BY_FIELD,
  DEFAULT_FILTERS,
  REPORT_FIELD_TYPES,
  FILTERS_FIELD
} from "./constants";
import NAMESPACE from "./namespace";
import { form, validations } from "./form";
import {
  buildReportFields,
  checkValue,
  formatAgeRange,
  formatReport
} from "./utils";
import { clearSelectedReport, saveReport } from "./action-creators";
import ReportFilters from "./components/filters";

const Container = ({ mode }) => {
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);
  const { id } = useParams();
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const primeroAgeRanges = useSelector(state => getAgeRanges(state));
  const report = useSelector(state => getReport(state));

  const [indexes, setIndexes] = useState(
    DEFAULT_FILTERS.map((data, index) => ({ index, data }))
  );

  const methods = useForm({
    validationSchema: validations(i18n)
  });

  const allRecordForms = useSelector(state =>
    getRecordForms(state, { all: true })
  );

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
      methods.register({ name: FILTERS_FIELD });

      const selectedReport = {
        ...formatReport(report.toJS())
      };

      setIndexes(
        selectedReport.filters.map((data, index) => ({ index, data }))
      );

      methods.reset(selectedReport);
    }
    if (formMode.get("isNew")) {
      methods.reset({});
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
        fields,
        filters: indexes.map(({ data: filter }) => ({
          ...filter,
          value: checkValue(filter)
        }))
      }
    };

    dispatch(
      saveReport({
        id,
        saveMethod: formMode.get("isEdit")
          ? SAVE_METHODS.update
          : SAVE_METHODS.new,
        body,
        message: formMode.get("isEdit")
          ? i18n.t("report.messages.updated")
          : i18n.t("report.messages.success")
      })
    );
  };

  useImperativeHandle(formRef, () => ({
    submitForm(e) {
      methods.handleSubmit(data => {
        onSubmit(data);
      })(e);
    }
  }));

  const formSections = form(
    i18n,
    formatAgeRange(primeroAgeRanges),
    allRecordForms,
    formMode.get("isNew")
  );

  const handleCancel = () => {
    dispatch(push(ROUTES.reports));
  };

  const pageHeading =
    report?.size && !formMode.get("isNew")
      ? report.getIn(["name", i18n.locale])
      : i18n.t("reports.register_new_report");

  const saveButton = (formMode.get("isEdit") || formMode.get("isNew")) && (
    <>
      <FormAction
        cancel
        actionHandler={handleCancel}
        text={i18n.t("buttons.cancel")}
        startIcon={<ClearIcon />}
      />
      <FormAction
        actionHandler={() => bindFormSubmit(formRef)}
        text={i18n.t("buttons.save")}
        savingRecord={false}
        startIcon={<CheckIcon />}
      />
    </>
  );

  const renderFormSections = () =>
    formSections.map(formSection => (
      <FormSection formSection={formSection} key={formSection.unique_id} />
    ));

  return (
    <LoadingIndicator
      hasData={
        formMode.get("isNew") || (report?.size > 0 && allRecordForms.size > 0)
      }
      loading={!report.size}
      type={NAMESPACE}
    >
      <PageContainer>
        <PageHeading title={pageHeading}>{saveButton}</PageHeading>
        <PageContent>
          <FormContext {...methods} formMode={formMode}>
            <form>
              {renderFormSections()}
              <ReportFilters
                allRecordForms={allRecordForms}
                parentFormMethods={methods}
                selectedReport={report}
                indexes={indexes}
                setIndexes={setIndexes}
              />
            </form>
          </FormContext>
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
