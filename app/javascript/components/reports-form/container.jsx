/* eslint-disable camelcase */

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useParams } from "react-router-dom";
import omit from "lodash/omit";

import { useI18n } from "../i18n";
import LoadingIndicator from "../loading-indicator";
import Form, { FormAction, whichFormMode } from "../form";
import { fetchReport } from "../report/action-creators";
import { getReport } from "../report/selectors";
import { PageContainer, PageContent, PageHeading } from "../page";
import bindFormSubmit from "../../libs/submit-form";
import { ROUTES, SAVE_METHODS } from "../../config";
import { getAgeRanges } from "../application/selectors";
import { getRecordForms } from "../record-form/selectors";

import {
  NAME,
  AGGREGATE_BY_FIELD,
  DISAGGREGATE_BY_FIELD,
  REPORT_FIELD_TYPES
} from "./constants";
import NAMESPACE from "./namespace";
import { form, validations } from "./form";
import { buildReportFields, formatAgeRange, formatReport } from "./utils";
import { clearSelectedReport, saveReport } from "./action-creators";

const Container = ({ mode }) => {
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);
  const { id } = useParams();
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const primeroAgeRanges = useSelector(state => getAgeRanges(state));
  const report = useSelector(state => getReport(state));

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

  const defaultFilters = [
    { attribute: "status", constraint: "", value: ["true"] },
    { attribute: "record_state", constraint: "", value: ["enabled"] }
  ];

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
        filters: defaultFilters
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

  const formSections = form(
    i18n,
    formatAgeRange(primeroAgeRanges),
    allRecordForms,
    formMode.get("isNew")
  );

  const handleCancel = () => {
    dispatch(push(ROUTES.reports));
  };

  const pageHeading = report?.size
    ? report.getIn(["name", i18n.locale])
    : i18n.t("reports.register_new_report");

  const saveButton = (formMode.get("isEdit") || formMode.get("isNew")) && (
    <>
      <FormAction
        cancel
        actionHandler={handleCancel}
        text={i18n.t("buttons.cancel")}
      />
      <FormAction
        actionHandler={() => bindFormSubmit(formRef)}
        text={i18n.t("buttons.save")}
        savingRecord={false}
      />
    </>
  );

  return (
    <LoadingIndicator
      hasData={formMode.get("isNew") || report?.size > 0}
      type={NAMESPACE}
    >
      <PageContainer>
        <PageHeading title={pageHeading}>{saveButton}</PageHeading>
        <PageContent>
          <Form
            useCancelPrompt
            mode={mode}
            formSections={formSections}
            onSubmit={onSubmit}
            ref={formRef}
            validations={validations(i18n)}
            initialValues={formatReport(report.toJS())}
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
