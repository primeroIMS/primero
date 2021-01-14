/* eslint-disable react/no-multi-comp, react/display-name */
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";

import { RECORD_TYPES } from "../../../../../../../config";
import { useI18n } from "../../../../../../i18n";
import { getShortIdFromUniqueId } from "../../../../../../records/utils";
import { selectRecord } from "../../../../../../records";
import { getFields, getRecordForms } from "../../../../../selectors";
import TraceActions from "../trace-actions";

import { NAME, TOP_FIELD_NAMES } from "./constants";

const Component = ({ selectedForm, recordType, potentialMatch, handleBack, handleConfirm }) => {
  const { id } = useParams();
  const record = useSelector(state => selectRecord(state, { isShow: true }, recordType, id));
  const i18n = useI18n();
  const fields = useSelector(state => getFields(state));
  const forms = useSelector(state =>
    getRecordForms(state, { primeroModule: record.get("module_id"), recordType: RECORD_TYPES.cases })
  );
  const traceId = getShortIdFromUniqueId(potentialMatch.getIn(["trace", "id"]));
  const caseId = potentialMatch.getIn(["case", "case_id_display"]);
  const comparedFields = potentialMatch.getIn(["comparison", "case_to_trace"], fromJS([]));
  const topFields = TOP_FIELD_NAMES.map(fieldName => fields.find(field => field.name === fieldName)).filter(
    field => field
  );

  const fieldRow = (field, traceValue, caseValue) => (
    <Grid container item key={field.name}>
      <Grid item xs={4}>
        <strong>{field.display_name[i18n.locale]}</strong>
      </Grid>
      <Grid item xs={4}>
        {traceValue}
      </Grid>
      <Grid item xs={4}>
        {caseValue}
      </Grid>
    </Grid>
  );

  const topRow = () =>
    topFields.map(field => {
      const comparedField = comparedFields.find(comparison => comparison.get("field_name") === field.name);

      return fieldRow(field, comparedField.get("trace_value"), comparedField.get("case_value"));
    });

  const renderForms = () =>
    forms.map(form => {
      const comparisons = form.fields
        .filter(field => !TOP_FIELD_NAMES.includes(field.name))
        .map(field => {
          const comparedField = comparedFields.find(comparison => comparison.get("field_name") === field.name);

          if (!comparedField?.size) {
            return null;
          }

          return { field, traceValue: comparedField.get("trace_value"), caseValue: comparedField.get("case_value") };
        })
        .filter(comparison => comparison?.field);

      if (!comparisons.length) {
        return null;
      }

      return (
        <>
          <Grid container item key={form.unique_id}>
            <Grid item xs={12}>
              <h2>{form.description[i18n.locale]}</h2>
            </Grid>
          </Grid>
          {comparisons.map(comparison => fieldRow(comparison.field, comparison.traceValue, comparison.caseValue))}
        </>
      );
    });

  return (
    <>
      <TraceActions handleBack={handleBack} handleConfirm={handleConfirm} selectedForm={selectedForm} />
      <Grid container spacing={2}>
        <Grid container item>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <h2>
              {i18n.t("tracing_request.trace")} {traceId}
            </h2>
          </Grid>
          <Grid item xs={4}>
            <h2>
              {i18n.t("case.label")} {caseId}
            </h2>
          </Grid>
        </Grid>
        {topRow()}
        {renderForms()}
      </Grid>
    </>
  );
};

Component.propTypes = {
  handleBack: PropTypes.func,
  handleConfirm: PropTypes.func,
  potentialMatch: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string.isRequired
};

Component.displayName = NAME;

export default Component;
