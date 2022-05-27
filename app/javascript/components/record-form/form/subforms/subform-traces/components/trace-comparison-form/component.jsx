/* eslint-disable react/no-multi-comp, react/display-name */
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";

import { RECORD_TYPES, RECORD_PATH } from "../../../../../../../config";
import { useI18n } from "../../../../../../i18n";
import { getShortIdFromUniqueId } from "../../../../../../records/utils";
import { getFields, getRecordFormsByUniqueId, getOrderedRecordForms } from "../../../../../selectors";
import { fetchMatchedTraces, getMatchedTraces, selectRecord, setMachedCaseForTrace } from "../../../../../../records";
import TraceActions from "../trace-actions";
import FieldRows from "../field-rows";
import ComparedForms from "../compared-forms";
import { FORMS } from "../../constants";
import { useMemoizedSelector } from "../../../../../../../libs";
import PhotoArray from "../../../../field-types/attachments/photo-array";
import AttachmentPreview from "../../../../field-types/attachments/attachment-preview";
import { ATTACHMENT_TYPES } from "../../../../field-types/attachments/constants";

import { NAME, TOP_FIELD_NAMES } from "./constants";
import { getComparisons } from "./utils";
import css from "./styles.css";

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
  const casePhotos = potentialMatch
    .getIn(["case", "photos"], fromJS([]))
    .reduce((acc, attachment) => acc.concat(attachment.get("attachment_url")), []);
  const caseAudios = potentialMatch.getIn(["case", "recorded_audio"], fromJS([]));
  const tracingRequestPhotos = record
    .get("photos", fromJS([]))
    .reduce((acc, attachment) => acc.concat(attachment.get("attachment_url")), []);
  const tracingRequestAudios = record.get("recorded_audio", fromJS([]));
  const traceId = potentialMatch.getIn(["trace", "id"]);
  const comparedFields = potentialMatch.getIn(["comparison", "case_to_trace"], fromJS([]));
  const familyFields = potentialMatch.getIn(["comparison", "family_to_inquirer"], fromJS([]));
  const potentialMatchedCaseId = potentialMatch.getIn(["trace", "matched_case_id"]);

  const caseSummaryMessage = () => {
    if (potentialMatchedCaseId) {
      return caseId === potentialMatchedCaseId
        ? "case.messages.already_matched"
        : "case.messages.already_matched_not_current_case";
    }

    return null;
  };

  const alreadyMatchedMessage = (() => {
    const message =
      recordType === RECORD_PATH.cases ? caseSummaryMessage() : "tracing_request.messages.already_matched";

    if (message) {
      return i18n.t(message);
    }

    return null;
  })();

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

  useEffect(() => {
    if (matchedCaseId) {
      setSelectedForm(FORMS.trace);
    }
  }, [matchedCaseId]);

  useEffect(() => {
    dispatch(fetchMatchedTraces(RECORD_PATH.cases, caseId));
  }, [caseId]);

  const traceActionsProps = {
    ...(!hideFindMatch && { handleConfirm }),
    ...(!hideBack && { handleBack }),
    selectedForm,
    recordType,
    mode
  };

  return (
    <>
      <TraceActions {...traceActionsProps} />
      <Grid container spacing={2}>
        <Grid container item>
          {renderText && alreadyMatchedMessage && (
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
        <FieldRows comparisons={topComparisons} />
        <Grid container item className={css.fieldRow} spacing={2}>
          <Grid item xs={6}>
            <h2>{i18n.t("tracing_request.tracing_request_photos")}</h2>
            <PhotoArray isGallery images={tracingRequestPhotos} />
          </Grid>
          <Grid item xs={6}>
            <h2>{i18n.t("tracing_request.case_photos")}</h2>
            <PhotoArray isGallery images={casePhotos} />
          </Grid>
        </Grid>
        <Grid container item className={css.fieldRow} spacing={2}>
          <Grid item xs={6}>
            <h2>{i18n.t("tracing_request.tracing_request_audios")}</h2>
            {tracingRequestAudios.map(audio => (
              <AttachmentPreview
                key={audio.get("id")}
                name={audio.get("file_name")}
                attachment={ATTACHMENT_TYPES.audio}
                attachmentUrl={audio.get("attachment_url")}
              />
            ))}
          </Grid>
          <Grid item xs={6}>
            <h2>{i18n.t("tracing_request.case_audios")}</h2>
            {caseAudios.map(audio => (
              <AttachmentPreview
                key={audio.get("id")}
                name={audio.get("file_name")}
                attachment={ATTACHMENT_TYPES.audio}
                attachmentUrl={audio.get("attachment_url")}
              />
            ))}
          </Grid>
        </Grid>
        <ComparedForms forms={comparedForms} />
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
