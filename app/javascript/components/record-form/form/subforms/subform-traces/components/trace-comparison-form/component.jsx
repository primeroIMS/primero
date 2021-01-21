/* eslint-disable react/no-multi-comp, react/display-name */
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { RECORD_TYPES, RECORD_PATH } from "../../../../../../../config";
import { compare } from "../../../../../../../libs";
import { useI18n } from "../../../../../../i18n";
import { getShortIdFromUniqueId } from "../../../../../../records/utils";
import { fetchMatchedTraces, getMatchedTraces, selectRecord, setMachedCaseForTrace } from "../../../../../../records";
import { getFields, getOrderedRecordForms } from "../../../../../selectors";
import TraceActions from "../trace-actions";
import FieldRow from "../field-row";
import { FORMS } from "../../constants";

import { NAME, TOP_FIELD_NAMES } from "./constants";
import { getComparisons } from "./utils";
import styles from "./styles.css";

const Component = ({ selectedForm, recordType, potentialMatch, setSelectedForm, traceValues }) => {
  const css = makeStyles(styles)();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { matched_case_id: matchedCaseId } = traceValues;
  const i18n = useI18n();

  const record = useSelector(state => selectRecord(state, { isShow: true }, recordType, id), compare);
  const fields = useSelector(state => getFields(state), compare);
  const forms = useSelector(
    state => getOrderedRecordForms(state, { primeroModule: record.get("module_id"), recordType: RECORD_TYPES.cases }),
    compare
  );
  const hasMatchedTraces = useSelector(state => Boolean(getMatchedTraces(state)?.size));

  const traceShortId = getShortIdFromUniqueId(potentialMatch.getIn(["trace", "id"]));
  const caseShortId = potentialMatch.getIn(["case", "case_id_display"]);
  const caseId = potentialMatch.getIn(["case", "id"]);
  const traceId = potentialMatch.getIn(["trace", "id"]);
  const comparedFields = potentialMatch.getIn(["comparison", "case_to_trace"], fromJS([]));

  const topFields = TOP_FIELD_NAMES.map(fieldName => fields.find(field => field.name === fieldName)).filter(
    field => field
  );

  const topComparisons = getComparisons({ fields: topFields, comparedFields, includeEmpty: true });

  const comparedForms = forms
    .filter(form =>
      comparedFields
        .map(compared => compared.get("field_name"))
        .some(fieldName => form.fields.map(field => field.name).includes(fieldName))
    )
    .map(form => {
      const comparisons = getComparisons({ fields: form.fields, comparedFields });

      return { form, comparisons };
    });

  const handleBack = () => setSelectedForm(FORMS.matches);
  const handleConfirm = () => dispatch(setMachedCaseForTrace({ caseId, traceId, recordType }));

  const renderFieldRows = comparisons =>
    comparisons.length &&
    comparisons.map(comparison => (
      <FieldRow
        field={comparison.field}
        traceValue={comparison.traceValue}
        caseValue={comparison.caseValue}
        match={comparison.match}
        key={comparison.field.name}
      />
    ));

  const renderForms = () =>
    comparedForms.map(comparedForm => {
      const { form, comparisons } = comparedForm;

      return (
        <React.Fragment key={form.unique_id}>
          <Grid container item>
            <Grid item xs={12}>
              <h2>{form.name[i18n.locale]}</h2>
            </Grid>
          </Grid>
          {renderFieldRows(comparisons) || (
            <Grid container item>
              <Grid item xs={12}>
                <span className={css.nothingFound}>{i18n.t("tracing_request.messages.nothing_found")}</span>
              </Grid>
            </Grid>
          )}
        </React.Fragment>
      );
    });

  useEffect(() => {
    if (matchedCaseId) {
      setSelectedForm(FORMS.trace);
    }
  }, [matchedCaseId]);

  useEffect(() => {
    dispatch(fetchMatchedTraces(RECORD_PATH.cases, caseId));
  }, [caseId]);

  return (
    <>
      <TraceActions
        handleBack={handleBack}
        handleConfirm={handleConfirm}
        selectedForm={selectedForm}
        recordType={recordType}
      />
      <Grid container spacing={2}>
        <Grid container item>
          {hasMatchedTraces && (
            <Grid item xs={12}>
              <div className={css.alreadyMatched}>
                <span>{i18n.t("tracing_request.messages.already_matched")}</span>
              </div>
            </Grid>
          )}
          <Grid item xs={2} />
          <Grid item xs={4}>
            <h2>
              {i18n.t("tracing_request.trace")} <span className={css.recordId}>{traceShortId}</span>
            </h2>
          </Grid>
          <Grid item xs={4}>
            <h2>
              {i18n.t("case.label")} <span className={css.recordId}>{caseShortId}</span>
            </h2>
          </Grid>
        </Grid>
        {renderFieldRows(topComparisons)}
        {renderForms()}
      </Grid>
    </>
  );
};

Component.propTypes = {
  potentialMatch: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string.isRequired,
  setSelectedForm: PropTypes.func.isRequired,
  traceValues: PropTypes.object
};

Component.displayName = NAME;

export default Component;
