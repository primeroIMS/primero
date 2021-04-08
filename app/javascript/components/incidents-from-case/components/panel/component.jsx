import { useState } from "react";
import PropTypes from "prop-types";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import LookupValue from "../../../record-form/form/subforms/subform-header-lookup";
import { useI18n } from "../../../i18n";
import { NAME_PANEL } from "../../constants";
import { MODULES, LOOKUPS } from "../../../../config";
import IncidentSummary from "../summary";
import IncidentDetail from "../detail";
import { useMemoizedSelector } from "../../../../libs";
import { getIncidentAvailable } from "../../../records";
import { useApp } from "../../../application";

const Component = ({
  incident,
  incidentCaseId,
  incidentCaseIdDisplay,
  css,
  mode,
  setFieldValue,
  handleSubmit,
  recordType,
  handleCreateIncident
}) => {
  const i18n = useI18n();
  const [expanded, setExpanded] = useState(false);
  const { online } = useApp();
  const handleExpanded = () => {
    setExpanded(!expanded);
  };

  const violationType =
    incident.get("module_id", false) === MODULES.CP ? "cp_incident_violence_type" : "gbv_sexual_violence_type";
  const incidentTypeData = incident.get(violationType, false) || undefined;
  const incidentUniqueID = incident.get("unique_id", false);
  const incidentDateData = incident.get("incident_date", false);
  const incidentDateInterviewData = incident.get("date_of_first_report", false);

  const incidentDate = incidentDateData && i18n.localizeDate(incidentDateData);
  const incidentDateInterview = incidentDateInterviewData && i18n.localizeDate(incidentDateInterviewData);
  const lookupViolenceType =
    incident.get("module_id", false) === MODULES.CP ? LOOKUPS.cp_violence_type : LOOKUPS.gbv_violence_type;
  const incidentType = <LookupValue value={incidentTypeData} optionsStringSource={lookupViolenceType} />;

  const incidentAvailable = useMemoizedSelector(state => getIncidentAvailable(state, incidentUniqueID));
  const isIncidentAvailable = online ? true : incidentAvailable;

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
    <div key={incident.get("unique_id")}>
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
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

Component.displayName = NAME_PANEL;

Component.propTypes = {
  css: PropTypes.object,
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
