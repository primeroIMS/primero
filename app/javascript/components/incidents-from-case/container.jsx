import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddIcon from "@material-ui/icons/Add";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";
import ActionButton from "../action-button";
import { useMemoizedSelector } from "../../libs";
import { CREATE_INCIDENT, RESOURCES } from "../../libs/permissions";
import { ID_FIELD, UNIQUE_ID_FIELD, INCIDENT_CASE_ID_DISPLAY_FIELD } from "../../config";
import { usePermissions } from "../user";
import { getIncidentFromCaseForm } from "../record-form/selectors";
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
  recordType,
  primeroModule,
  dirty
}) => {
  const css = useStyles();
  const i18n = useI18n();

  const incidentFromCaseForm = useMemoizedSelector(state =>
    getIncidentFromCaseForm(state, { i18n, recordType, primeroModule })
  );

  const canAddIncidents = usePermissions(RESOURCES.cases, CREATE_INCIDENT);

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
        dirty={dirty}
      />
    ));

  const newIncidentBtn = canAddIncidents && (
    <ActionButton
      icon={<AddIcon />}
      text={i18n.t("buttons.new")}
      type="default_button"
      rest={{
        onClick: event => handleCreateIncident(event, dirty)
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
        <RecordFormAlerts recordType={recordType} form={incidentFromCaseForm} />
      </div>
      {renderIncidents}
    </div>
  );
};

Container.displayName = NAME;

Container.defaultProps = {
  dirty: false
};

Container.propTypes = {
  dirty: PropTypes.bool,
  handleCreateIncident: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  handleToggleNav: PropTypes.func.isRequired,
  incidents: PropTypes.object,
  mobileDisplay: PropTypes.bool.isRequired,
  mode: PropTypes.object,
  primeroModule: PropTypes.string,
  record: PropTypes.object,
  recordType: PropTypes.string,
  setFieldValue: PropTypes.func
};
export default Container;
