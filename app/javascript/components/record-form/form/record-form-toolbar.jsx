import PropTypes from "prop-types";
import { Badge } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import { push } from "connected-react-router";
import { batch, useDispatch } from "react-redux";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

import { getIncidentFromCase } from "../../records";
import { SaveReturnIcon } from "../../../images/primero-icons";
import { useI18n } from "../../i18n";
import Flagging from "../../flagging";
import RecordActions from "../../record-actions";
import Permission, { FLAG_RECORDS, WRITE_RECORDS } from "../../permissions";
import { getSavingRecord, getLoadingRecordState, getCaseIdDisplayForIncident, getCaseIdForIncident } from "../../records/selectors";
import {
  RECORD_TYPES,
  RECORD_PATH,
  INCIDENT_CASE_ID_DISPLAY_FIELD,
  INCIDENT_CASE_ID_FIELD,
  INCIDENT_FROM_CASE
} from "../../../config";
import DisableOffline from "../../disable-offline";
import { useMemoizedSelector, useThemeHelper } from "../../../libs";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";
import { getIsEnabledWebhookSyncFor } from "../../application/selectors";
import { PageHeading } from "../../page";

import { RECORD_FORM_TOOLBAR_NAME } from "./constants";
import { WorkflowIndicator } from "./components";
import css from "./styles.css";
import RecordPageHeading from "./page-heading";
import DisabledRecordIndicator from "./components/disabled-record-indicator";

const RecordFormToolbar = ({
  handleFormSubmit,
  caseIdDisplay,
  history,
  mode,
  params,
  primeroModule,
  record,
  recordType,
  shortId
}) => {
  const { isRTL } = useThemeHelper();
  const dispatch = useDispatch();
  const i18n = useI18n();

  const savingRecord = useMemoizedSelector(state => getSavingRecord(state, params.recordType));
  const loadingRecord = useMemoizedSelector(state => getLoadingRecordState(state, params.recordType));
  const incidentFromCase = useMemoizedSelector(state => getIncidentFromCase(state, recordType));
  const incidentCaseIdDisplay = useMemoizedSelector(state => getCaseIdDisplayForIncident(state, recordType));
  const incidentCaseId = useMemoizedSelector(state => getCaseIdForIncident(state, recordType));
  const isEnabledWebhookSyncFor = useMemoizedSelector(state =>
    getIsEnabledWebhookSyncFor(state, primeroModule, recordType)
  );

  const rtlClass = isRTL ? css.flipImage : "";

  const handleReturnToCase = () => {
    batch(() => {
      dispatch(
        push(`/${RECORD_PATH.cases}/${incidentFromCase.get(INCIDENT_CASE_ID_FIELD)}`, {
          selectedForm: INCIDENT_FROM_CASE
        })
      );
    });
  };

  const goBack = () => {
    if (incidentFromCase?.size && recordType === RECORD_TYPES.incidents) {
      handleReturnToCase();
    } else {
      history.goBack();
    }
  };

  const getIncidentFromCaseIdDisplay = () => {
    if (recordType === RECORD_TYPES.incidents) {
      return incidentFromCase?.size
        ? incidentFromCase.get(INCIDENT_CASE_ID_DISPLAY_FIELD)
        : record?.get(INCIDENT_CASE_ID_DISPLAY_FIELD);
    }

    return null;
  };

  const getIncidentFromCaseId = () => {
    if (recordType === RECORD_TYPES.incidents) {
      return incidentFromCase?.size
        ? incidentFromCase.get(INCIDENT_CASE_ID_FIELD)
        : record?.get(INCIDENT_CASE_ID_FIELD);
    }

    return null;
  };

  const renderSaveButton = (
    <ActionButton
      id="buttons.save_and_return"
      icon={
        incidentFromCase?.size && recordType === RECORD_TYPES.incidents ? (
          <SaveReturnIcon isRTL={isRTL} />
        ) : (
          <CheckIcon />
        )
      }
      text={i18n.t(
        incidentFromCase?.size && recordType === RECORD_TYPES.incidents ? "buttons.save_and_return" : "buttons.save"
      )}
      type={ACTION_BUTTON_TYPES.default}
      pending={savingRecord}
      noTranslate
      rest={{
        onClick: handleFormSubmit
      }}
    />
  );

  let renderRecordStatusIndicator = null;

  if (record && !record.get("enabled")) {
    renderRecordStatusIndicator = <DisabledRecordIndicator recordType={recordType} />;
  } else if ((mode.isShow || mode.isEdit) && params.recordType === RECORD_PATH.cases) {
    renderRecordStatusIndicator = (
      <WorkflowIndicator
        locale={i18n.locale}
        primeroModule={primeroModule}
        recordType={params.recordType}
        record={record}
      />
    );
  }

  const title = (
    <RecordPageHeading
      caseIdDisplay={caseIdDisplay}
      i18n={i18n}
      mode={mode}
      params={params}
      recordType={recordType}
      shortId={shortId}
      incidentCaseId={!!incidentCaseId ? incidentCaseId : getIncidentFromCaseId()}
      incidentCaseIdDisplay={!!incidentCaseIdDisplay ? incidentCaseIdDisplay : getIncidentFromCaseIdDisplay()}
      toolbarHeading={css.toolbarHeading}
      associatedLinkClass={css.associatedCaseLink}
      isEnabledWebhookSyncFor={isEnabledWebhookSyncFor}
      syncedAt={record?.get("synced_at")}
      syncStatus={record?.get("sync_status")}
    />
  );

  return (
    <PageHeading title={title} prefixComponent={renderRecordStatusIndicator}>
      <>
        {mode.isShow && params && recordType === RECORD_TYPES.incidents && incidentFromCase?.size ? (
          <ActionButton
            icon={<KeyboardBackspaceIcon className={rtlClass} />}
            text="buttons.return_to_case"
            type={ACTION_BUTTON_TYPES.default}
            cancel
            rest={{ onClick: handleReturnToCase }}
          />
        ) : null}
        {mode.isShow && params && (
          <Permission resources={params.recordType} actions={FLAG_RECORDS}>
            <DisableOffline button>
              <Badge color="error" badgeContent={record.get("flag_count")} className={css.badgeIndicator}>
                <Flagging record={params.id} recordType={params.recordType} />
              </Badge>
            </DisableOffline>
          </Permission>
        )}
        {(mode.isEdit || mode.isNew) && (
          <>
            <ActionButton
              icon={<ClearIcon />}
              text="buttons.cancel"
              type={ACTION_BUTTON_TYPES.default}
              cancel
              onClick={goBack}
            />
            {renderSaveButton}
          </>
        )}
        {mode.isShow && (
          <Permission resources={params.recordType} actions={WRITE_RECORDS}>
            <ActionButton
              icon={<CreateIcon />}
              text="buttons.edit"
              type={ACTION_BUTTON_TYPES.default}
              rest={{
                to: `/${params.recordType}/${params.id}/edit`,
                component: Link,
                disabled: loadingRecord
              }}
            />
          </Permission>
        )}
        <RecordActions recordType={params.recordType} record={record} mode={mode} />
      </>
    </PageHeading>
  );
};

RecordFormToolbar.displayName = RECORD_FORM_TOOLBAR_NAME;

RecordFormToolbar.propTypes = {
  caseIdDisplay: PropTypes.string,
  handleFormSubmit: PropTypes.func.isRequired,
  history: PropTypes.object,
  mode: PropTypes.object,
  params: PropTypes.object.isRequired,
  primeroModule: PropTypes.string.isRequired,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  shortId: PropTypes.string
};

export default withRouter(RecordFormToolbar);
