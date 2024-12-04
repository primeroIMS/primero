// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import LookupValue from "../../../record-form/form/subforms/subform-header-lookup";
import { useI18n } from "../../../i18n";
import { NAME_PANEL } from "../../constants";
import IncidentSummary from "../summary";
import IncidentDetail from "../detail";
import useMemoizedSelector from "../../../../libs/use-memoized-selector";
import { getIncidentAvailable } from "../../../records";
import { getFieldByName } from "../../../record-form/selectors";
import { getViolenceType } from "../../selectors";

function Component({
  incident,
  incidentCaseId,
  incidentCaseIdDisplay,
  css,
  mode,
  setFieldValue,
  handleSubmit,
  recordType,
  handleCreateIncident,
  dirty = false
}) {
  const i18n = useI18n();
  const [expanded, setExpanded] = useState(false);
  const handleExpanded = () => {
    setExpanded(!expanded);
  };
  const violationType = useMemoizedSelector(state => getViolenceType(state, incident.get("module_id")));
  const incidentTypeData = incident.get(violationType, false) || undefined;
  const incidentUniqueID = incident.get("unique_id", false);
  const incidentDateData = incident.get("incident_date", false);
  const incidentDateInterviewData = incident.get("date_of_first_report", false);

  const incidentDate = incidentDateData && i18n.localizeDate(incidentDateData);
  const incidentDateInterview = incidentDateInterviewData && i18n.localizeDate(incidentDateInterviewData);

  const isIncidentAvailable = useMemoizedSelector(state => getIncidentAvailable(state, incidentUniqueID));
  const violenceTypeField = useMemoizedSelector(state => getFieldByName(state, violationType));
  const lookupViolenceType = violenceTypeField.option_strings_source?.replace(/lookup /, "");

  const incidentType = lookupViolenceType && (
    <LookupValue value={incidentTypeData} optionsStringSource={lookupViolenceType} />
  );

  const sharedProps = {
    incident,
    css,
    incidentCaseId,
    incidentCaseIdDisplay,
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
    <div key={incident.get("unique_id")} data-testid="incident-panel">
      <Accordion expanded={expanded} onChange={handleExpanded} className={css.panel}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filter-controls-content"
          id={incident.get("unique_id")}
          classes={{
            expandIcon: css.expandIcon
          }}
        >
          <IncidentSummary {...sharedProps} />
        </AccordionSummary>
        <AccordionDetails>
          <IncidentDetail
            {...sharedProps}
            handleCreateIncident={handleCreateIncident}
            incidentAvailable={isIncidentAvailable}
            dirty={dirty}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

Component.displayName = NAME_PANEL;

Component.propTypes = {
  css: PropTypes.object,
  dirty: PropTypes.bool,
  handleCreateIncident: PropTypes.func,
  handleSubmit: PropTypes.func,
  incident: PropTypes.object.isRequired,
  incidentCaseId: PropTypes.string.isRequired,
  incidentCaseIdDisplay: PropTypes.string.isRequired,
  mode: PropTypes.object,
  recordModule: PropTypes.string,
  recordType: PropTypes.string,
  setFieldValue: PropTypes.func
};
export default Component;
