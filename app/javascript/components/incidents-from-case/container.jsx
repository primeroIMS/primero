import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddIcon from "@material-ui/icons/Add";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";
import ActionButton from "../action-button";
import { CREATE_INCIDENT, RESOURCES } from "../../libs/permissions";
import { ID_FIELD, UNIQUE_ID_FIELD, INCIDENT_CASE_ID_DISPLAY_FIELD, INCIDENT_FROM_CASE } from "../../config";
import { usePermissions } from "../user";
import { getRecordInformationForms } from "../record-form/form/utils";
import RecordFormAlerts from "../record-form-alerts";

import styles from "./styles.css";
import { NAME } from "./constants";
import IncidentPanel from "./components/panel";

const useStyles = makeStyles(styles);

const Container = ({
  handleCreateIncident,
  record,
  incidents,
  mobileDisplay,
  handleToggleNav,
  mode,
  setFieldValue,
  handleSubmit,
  recordType
}) => {
  const css = useStyles();
  const i18n = useI18n();
  const canAddIncidents = usePermissions(RESOURCES.cases, CREATE_INCIDENT);
  const recordInformationForms = getRecordInformationForms(i18n);

  const renderIncidents =
    incidents &&
    incidents.map(incident => (
      <IncidentPanel
        key={incident.get(UNIQUE_ID_FIELD)}
        incidentCaseId={record.get(ID_FIELD)}
        incidentCaseIdDisplay={record.get(INCIDENT_CASE_ID_DISPLAY_FIELD)}
        incident={incident}
        css={css}
        mode={mode}
        setFieldValue={setFieldValue}
        handleSubmit={handleSubmit}
        recordType={recordType}
        handleCreateIncident={handleCreateIncident}
      />
    ));

  const newIncidentBtn = canAddIncidents && (
    <ActionButton
      icon={<AddIcon />}
      text={i18n.t("buttons.new")}
      type="default_button"
      rest={{
        onClick: handleCreateIncident
      }}
    />
  );

  return (
    <div>
      <div className={css.container}>
        <RecordFormTitle
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          displayText={i18n.t("incidents.label")}
        />
        <div>{newIncidentBtn}</div>
      </div>
      <div className={css.alerts}>
        <RecordFormAlerts recordType={recordType} form={recordInformationForms[INCIDENT_FROM_CASE]} />
      </div>
      {renderIncidents}
    </div>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  handleCreateIncident: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  handleToggleNav: PropTypes.func.isRequired,
  incidents: PropTypes.object,
  mobileDisplay: PropTypes.bool.isRequired,
  mode: PropTypes.object,
  record: PropTypes.object,
  recordType: PropTypes.string,
  setFieldValue: PropTypes.func
};
export default Container;
