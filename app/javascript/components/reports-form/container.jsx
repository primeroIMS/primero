/* eslint-disable camelcase */

import React, { useRef, useImperativeHandle, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { FormContext, useForm } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import { useParams } from "react-router-dom";

import { useI18n } from "../i18n";
import LoadingIndicator from "../loading-indicator";
import { FormAction, whichFormMode } from "../form";
import { fetchReport } from "../report/action-creators";
import { getReport } from "../report/selectors";
import { PageContainer, PageContent, PageHeading } from "../page";
import bindFormSubmit from "../../libs/submit-form";
import { RECORD_TYPES, ROUTES } from "../../config";
import FormSection from "../form/components/form-section";
import { getAgeRanges } from "../application/selectors";
import {
  getRecordForms,
  getRecordFormsByUniqueId
} from "../record-form/selectors";

import {
  NAME,
  NAME_FIELD,
  DESCRIPTION_FIELD,
  MODULES_FIELD,
  RECORD_TYPE_FIELD,
  AGGREGATE_BY_FIELD,
  DISAGGREGATE_BY_FIELD,
  GROUP_AGES_FIELD,
  GROUP_DATES_BY_FIELD,
  IS_GRAPH_FIELD
} from "./constants";
import NAMESPACE from "./namespace";
import { form, validations } from "./form";
import {
  buildFields,
  dependantFields,
  formatAgeRange,
  getFormName
} from "./utils";
import ReportFilters from "./components/filters";

const Container = ({ mode }) => {
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);
  const validationSchema = validations(i18n);
  const { id } = useParams();
  const methods = useForm({
    validationSchema
  });
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const selectedModule = methods.watch("modules");
  const selectedRecordType = methods.watch("record_type");
  const emptyModule = isEmpty(selectedModule);
  const emptyRecordType = isEmpty(selectedRecordType);
  const isModuleTouched = Object.keys(
    methods.control.formState.touched
  ).includes("modules");
  const primeroAgeRanges = useSelector(state => getAgeRanges(state));
  const report = useSelector(state => getReport(state));

  const recordTypesForms = useSelector(state =>
    getRecordForms(state, {
      recordType: selectedRecordType,
      primeroModule: selectedModule
    })
  );

  const reportableForm = useSelector(state =>
    getRecordFormsByUniqueId(state, {
      recordType: RECORD_TYPES.cases,
      primeroModule: selectedModule,
      formName: getFormName(selectedRecordType)
    })
  )?.toJS()?.[0]?.fields?.[0]?.subform_section_id;

  useEffect(() => {
    if (isEditOrShow) {
      dispatch(fetchReport(id));
    }
  }, [id]);

  const defaultFilters = [
    { attribute: "status", constraint: "=", value: ["open"] },
    { attribute: "age", constraint: "not_null", value: ["male"] }
  ];

  useEffect(() => {
    if (report.size) {
      methods.register({ name: "filters" });

      // TODO: Should be returned by API
      const valueFromSelector = {
        name: {
          en: "Registration CP"
        },
        description: {
          en: "Case registrations over time"
        },
        modules: ["primeromodule-cp"],
        record_type: "case",
        aggregate_by: ["age"],
        disaggregate_by: ["sex"],
        filters: defaultFilters
      };

      console.log("RESET");
      methods.reset(valueFromSelector);
    }
  }, [report]);

  const onSuccess = data => {
    console.log("onSuccess data", data);
    // Object.entries(data).forEach(entry =>
    //   Object.entries(entry[1]).forEach(valueEntry => {
    //     if (!methods.control[`fields.${entry[0]}.${valueEntry[0]}`]) {
    //       methods.register({ name: `fields.${entry[0]}.${valueEntry[0]}` });
    //     }
    //     methods.setValue(`fields.${entry[0]}.${valueEntry[0]}`, valueEntry[1]);
    //   })
    // );
  };

  const onSubmit = data => console.log("ON SUBMIT", data);

  useImperativeHandle(formRef, () => ({
    submitForm(e) {
      methods.handleSubmit(data => {
        onSubmit(data);
      })(e);
    }
  }));

  const fields = buildFields(
    getFormName(selectedRecordType) ? reportableForm : recordTypesForms,
    i18n.locale,
    Boolean(getFormName(selectedRecordType))
  );

  const formSections = form(
    i18n,
    emptyModule,
    emptyModule || emptyRecordType,
    formatAgeRange(primeroAgeRanges),
    fields
  );

  if (isModuleTouched && emptyModule) {
    const name = methods.getValues()[NAME_FIELD];
    const description = methods.getValues()[DESCRIPTION_FIELD];

    methods.reset({
      ...methods.getValues(),
      ...dependantFields(formSections)
    });

    if (name) {
      methods.setValue(NAME_FIELD, name);
    }

    if (description) {
      methods.setValue(DESCRIPTION_FIELD, description);
    }
  }

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
      hasData={formMode.get("isNew") || (report?.size > 0 && fields.length)}
      loading={!fields.length}
      type={NAMESPACE}
    >
      <PageContainer>
        <PageHeading title={pageHeading}>{saveButton}</PageHeading>
        <PageContent>
          <FormContext {...methods} formMode={formMode}>
            <form>
              {formSections.map(formSection => (
                <FormSection
                  formSection={formSection}
                  key={formSection.unique_id}
                />
              ))}
              <ReportFilters
                defaultFilters={defaultFilters}
                fields={fields}
                register={methods.register}
                formMode={formMode}
                methods={methods}
                onSuccess={onSuccess}
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
