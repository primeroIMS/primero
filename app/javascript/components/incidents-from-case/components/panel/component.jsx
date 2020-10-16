import React, { useState } from "react";
import PropTypes from "prop-types";
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import LookupValue from "../../../record-form/form/subforms/subform-header-lookup";
import { useI18n } from "../../../i18n";
import { NAME_PANEL, VIOLENCE_TYPE_LOOKUP_NAME } from "../../constants";
import { MODULES } from "../../../../config";
import IncidentSummary from "../summary";
import IncidentDetail from "../detail";

const Component = ({ incident, incidentCaseId, css, mode, setFieldValue, handleSubmit, recordType }) => {
  const i18n = useI18n();
  const [expanded, setExpanded] = useState(false);

  const handleExpanded = () => {
    setExpanded(!expanded);
  };

  const fieldDate = incident.get("module_id", false) === MODULES.CP ? "cp_incident_date" : "incident_date";
  const violationType =
    incident.get("module_id", false) === MODULES.CP ? "cp_incident_violence_type" : "gbv_sexual_violence_type";
  const incidentTypeData = incident.get(violationType, false);
  const incidentUniqueID = incident.get("unique_id", false);
  const incidentDateData = incident.get(fieldDate, false);
  const incidentDateInterviewData = incident.get("date_of_first_report", false);

  const incidentDate = incidentDateData && i18n.localizeDate(incidentDateData);
  const incidentDateInterview = incidentDateInterviewData && i18n.localizeDate(incidentDateInterviewData);
  const incidentType = <LookupValue value={incidentTypeData} optionsStringSource={VIOLENCE_TYPE_LOOKUP_NAME} />;

  const sharedProps = {
    incident,
    css,
    incidentCaseId,
    incidentDate,
    incidentDateInterview,
    incidentType,
    incidentUniqueID,
    mode,
    setFieldValue,
    handleSubmit,
    recordType
  };

  return (
    <div key={incident.get("unique_id")}>
      <ExpansionPanel expanded={expanded} onChange={handleExpanded} className={css.panel}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filter-controls-content"
          id={incident.get("unique_id")}
          classes={{
            expandIcon: css.expandIcon
          }}
        >
          <IncidentSummary {...sharedProps} />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <IncidentDetail {...sharedProps} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

Component.displayName = NAME_PANEL;

Component.propTypes = {
  css: PropTypes.object,
  handleSubmit: PropTypes.func,
  incident: PropTypes.object.isRequired,
  incidentCaseId: PropTypes.string.isRequired,
  mode: PropTypes.object,
  recordModule: PropTypes.string,
  recordType: PropTypes.string,
  setFieldValue: PropTypes.func
};
export default Component;
