/* eslint-disable react/no-multi-comp, react/display-name */
import { Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { RECORD_TYPES, RECORD_PATH } from "../../../../../../../config";
import { useI18n } from "../../../../../../i18n";
import { getShortIdFromUniqueId } from "../../../../../../records/utils";
import { getFields, getRecordFormsByUniqueId, getOrderedRecordForms } from "../../../../../selectors";
import { fetchMatchedTraces, getMatchedTraces, selectRecord, setMachedCaseForTrace } from "../../../../../../records";
import TraceActions from "../trace-actions";
import FieldRow from "../field-row";
import { FORMS } from "../../constants";
import { useMemoizedSelector } from "../../../../../../../libs";

import { NAME, TOP_FIELD_NAMES } from "./constants";
import { getComparisons } from "./utils";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({
  selectedForm,
  recordType,
  potentialMatch,
  setSelectedForm,
  traceValues,
  hideFindMatch,
  hideBack,
  mode
}) => {
  const css = useStyles();
  const { id } = useParams();
  const dispatch = useDispatch();
  // eslint-disable-next-line camelcase
  const matchedCaseId = traceValues?.matched_case_id;
  const i18n = useI18n();

  const record = useMemoizedSelector(state => selectRecord(state, { isEditOrShow: true, recordType, id }));
  const fields = useMemoizedSelector(state => getFields(state));
  const forms = useMemoizedSelector(state =>
    getOrderedRecordForms(state, { primeroModule: record.get("module_id"), recordType: RECORD_TYPES.cases })
  );
  const subformFamilyDetails = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      primeroModule: record.get("module_id"),
      recordType: RECORD_TYPES.cases,
      formName: "family_details_section",
      includeNested: true,
      checkVisible: false
    })?.first()
  );
  const hasMatchedTraces = useMemoizedSelector(state => Boolean(getMatchedTraces(state)?.size));

  const traceShortId = getShortIdFromUniqueId(potentialMatch.getIn(["trace", "id"]));
  const caseShortId = potentialMatch.getIn(["case", "case_id_display"]);
  const caseId = potentialMatch.getIn(["case", "id"]);
  const traceId = potentialMatch.getIn(["trace", "id"]);
  const comparedFields = potentialMatch.getIn(["comparison", "case_to_trace"], fromJS([]));
  const familyFields = potentialMatch.getIn(["comparison", "family_to_inquirer"], fromJS([]));
  const potentialMatchedCaseId = potentialMatch.getIn(["trace", "matched_case_id"]);
  let caseSummaryMessage = "";

  if (potentialMatchedCaseId) {
    caseSummaryMessage =
      caseId === potentialMatchedCaseId
        ? "case.messages.already_matched"
        : "case.messages.already_matched_not_current_case";
  }

  const alreadyMatchedMessage = i18n.t(
    recordType === RECORD_PATH.cases ? caseSummaryMessage : "tracing_request.messages.already_matched"
  );

  const renderText =
    recordType === RECORD_PATH.cases || (hasMatchedTraces && recordType === RECORD_PATH.tracing_requests);

  const topFields = TOP_FIELD_NAMES.map(fieldName => fields.find(field => field.name === fieldName)).filter(
    field => field
  );

  const topComparisons = getComparisons({ fields: topFields, comparedFields, includeEmpty: true });

  const getFamilyComparison = () =>
    familyFields.map((detailFields, index) => {
      const comparisons = getComparisons({ fields: subformFamilyDetails?.fields, comparedFields: detailFields });

      return { form: subformFamilyDetails, comparisons, index };
    });

  const comparedForms = forms
    .filter(form =>
      comparedFields
        .map(compared => compared.get("field_name"))
        .some(fieldName => form.fields.map(field => field.name).includes(fieldName))
    )
    .map((form, index) => {
      const comparisons = getComparisons({ fields: form.fields, comparedFields });

      return { form, comparisons, index };
    })
    .concat(familyFields?.size ? getFamilyComparison() : fromJS([]));

  const handleBack = () => setSelectedForm(FORMS.matches);
  const handleConfirm = () =>
    dispatch(
      setMachedCaseForTrace({
        caseId,
        traceId,
        recordType,
        message: i18n.t("tracing_request.messages.match_action", {
          trace_id: getShortIdFromUniqueId(traceId),
          record_id: getShortIdFromUniqueId(caseId)
        })
      })
    );

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
      const { form, comparisons, index } = comparedForm;

      return (
        <Fragment key={`${form.unique_id}-${index}`}>
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
        </Fragment>
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

  const traceActionsProps = {
    ...{ ...(!hideFindMatch ? { handleConfirm } : {}) },
    ...{ ...(!hideBack ? { handleBack } : {}) },
    selectedForm,
    recordType,
    mode
  };

  return (
    <>
      <TraceActions {...traceActionsProps} />
      <Grid container spacing={2}>
        <Grid container item>
          {renderText && (
            <Grid item xs={12}>
              <div className={css.alreadyMatched}>
                <span>{alreadyMatchedMessage}</span>
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
  hideBack: PropTypes.bool,
  hideFindMatch: PropTypes.bool,
  mode: PropTypes.object,
  potentialMatch: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string.isRequired,
  setSelectedForm: PropTypes.func.isRequired,
  traceValues: PropTypes.object
};

Component.displayName = NAME;

export default Component;
