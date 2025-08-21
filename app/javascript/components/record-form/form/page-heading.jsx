// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Permission, { READ_RECORDS, SHOW_SYNC_EXTERNAL } from "../../permissions";
import { RECORD_PATH } from "../../../config";
import useSystemStrings, { PAGE } from "../../application/use-system-strings";

import { RECORD_FORM_TOOLBAR_PAGE_HEADING_NAME } from "./constants";
import { SyncRecord } from "./components";

function Component({
  i18n,
  mode,
  params,
  recordType,
  shortId,
  caseIdDisplay,
  toolbarHeading,
  associatedLinkClass,
  incidentCaseId,
  incidentCaseIdDisplay,
  isEnabledWebhookSyncFor,
  syncedAt,
  syncStatus
}) {
  let heading = "";

  const { label } = useSystemStrings(PAGE);

  if (mode.isNew) {
    heading = label(`${params.recordType}.register_new_${recordType}`);
  } else if (mode.isEdit || mode.isShow) {
    heading = label(`${params.recordType}.show_${recordType}`, "", {
      short_id: params.recordType === RECORD_PATH.cases && caseIdDisplay ? caseIdDisplay : shortId || "-------"
    });
  }

  const caseIncidentShortID = incidentCaseId?.substr(incidentCaseId.length - 7);

  const associatedCase =
    params.recordType === RECORD_PATH.incidents && incidentCaseId ? (
      <Permission resources={RECORD_PATH.cases} actions={READ_RECORDS}>
        <p className={associatedLinkClass}>
          {i18n.t("incident.associated_case")}{" "}
          <Link to={`/cases/${incidentCaseId}`}>{incidentCaseIdDisplay || shortId || caseIncidentShortID}</Link>
        </p>
      </Permission>
    ) : null;

  const syncRecord = mode.isShow && (
    <Permission resources={RECORD_PATH.cases} actions={SHOW_SYNC_EXTERNAL}>
      <SyncRecord
        i18n={i18n}
        isEnabledWebhookSyncFor={isEnabledWebhookSyncFor}
        syncedAt={syncedAt}
        syncStatus={syncStatus}
        params={params}
      />
    </Permission>
  );

  return (
    <>
      <h2 className={toolbarHeading}>{heading}</h2>
      {associatedCase}
      {syncRecord}
    </>
  );
}

Component.displayName = RECORD_FORM_TOOLBAR_PAGE_HEADING_NAME;

Component.propTypes = {
  associatedLinkClass: PropTypes.string,
  caseIdDisplay: PropTypes.string,
  i18n: PropTypes.shape({
    t: PropTypes.func
  }),
  incidentCaseId: PropTypes.string,
  incidentCaseIdDisplay: PropTypes.string,
  isEnabledWebhookSyncFor: PropTypes.bool,
  mode: PropTypes.object,
  params: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  shortId: PropTypes.string,
  syncedAt: PropTypes.string,
  syncStatus: PropTypes.string,
  toolbarHeading: PropTypes.string
};

export default Component;
