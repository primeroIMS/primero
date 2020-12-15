import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

import Permission from "../../application/permission";
import { RECORD_PATH } from "../../../config";
import { READ_RECORDS } from "../../../libs/permissions";

import { RECORD_FORM_TOOLBAR_PAGE_HEADING_NAME } from "./constants";

const Component = ({
  i18n,
  mode,
  params,
  recordType,
  shortId,
  caseIdDisplay,
  toolbarHeading,
  associatedLinkClass,
  incidentCaseId,
  incidentCaseIdDisplay
}) => {
  let heading = "";

  if (mode.isNew) {
    heading = i18n.t(`${params.recordType}.register_new_${recordType}`);
  } else if (mode.isEdit || mode.isShow) {
    heading = i18n.t(`${params.recordType}.show_${recordType}`, {
      short_id: params.recordType === RECORD_PATH.cases ? caseIdDisplay : shortId || "-------"
    });
  }

  const associatedCase =
    params.recordType === RECORD_PATH.incidents && incidentCaseId && incidentCaseIdDisplay ? (
      <Permission resources={RECORD_PATH.cases} actions={READ_RECORDS}>
        <p className={associatedLinkClass}>
          {i18n.t("incident.associated_case")} <Link to={`/cases/${incidentCaseId}`}>{incidentCaseIdDisplay}</Link>
        </p>
      </Permission>
    ) : null;

  return (
    <>
      <h2 className={toolbarHeading}>{heading}</h2>
      {associatedCase}
    </>
  );
};

Component.displayName = RECORD_FORM_TOOLBAR_PAGE_HEADING_NAME;

Component.propTypes = {
  associatedLinkClass: PropTypes.string,
  caseIdDisplay: PropTypes.string,
  i18n: PropTypes.shape({
    t: PropTypes.func
  }),
  incidentCaseId: PropTypes.string,
  incidentCaseIdDisplay: PropTypes.string,
  mode: PropTypes.object,
  params: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  shortId: PropTypes.string,
  toolbarHeading: PropTypes.string
};

export default Component;
