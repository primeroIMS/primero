import { useState } from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch } from "react-redux";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";
import ActionButton from "../action-button";
import { CREATE_INCIDENT, RESOURCES } from "../../libs/permissions";
import {
  ID_FIELD,
  MODULE_TYPE_FIELD,
  UNIQUE_ID_FIELD,
  INCIDENT_CASE_ID_DISPLAY_FIELD,
  INCIDENT_FROM_CASE
} from "../../config";
import { usePermissions } from "../user";
import { fetchIncidentFromCase } from "../records";
import { getRecordInformationForms } from "../record-form/form/utils";
import RecordFormAlerts from "../record-form-alerts";

import styles from "./styles.css";
import { NAME } from "./constants";
import IncidentPanel from "./components/panel";
import RedirectDialog from "./components/redirect-dialog";

const Container = ({
  record,
  incidents,
  mobileDisplay,
  handleToggleNav,
  mode,
  setFieldValue,
  handleSubmit,
  recordType
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [redirectOpts, setRedirectOpts] = useState({});
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
      />
    ));
  const handleCreateIncidentBtn = () => {
    if (!mode.isShow) {
      setRedirectOpts({ open: true });
    } else {
      dispatch(
        fetchIncidentFromCase(
          record.get(ID_FIELD),
          record.get(INCIDENT_CASE_ID_DISPLAY_FIELD),
          record.get(MODULE_TYPE_FIELD)
        )
      );
    }
  };
  const newIncidentBtn = canAddIncidents && (
    <ActionButton
      icon={<AddIcon />}
      text={i18n.t("buttons.new")}
      type="default_button"
      rest={{
        onClick: handleCreateIncidentBtn
      }}
    />
  );
  const renderDialog = redirectOpts.open && !mode.isShow && (
    <RedirectDialog
      setRedirectOpts={setRedirectOpts}
      setFieldValue={setFieldValue}
      handleSubmit={handleSubmit}
      mode={mode}
      recordType={recordType}
      {...redirectOpts}
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
      {renderDialog}
    </div>
  );
};

Container.displayName = NAME;

Container.propTypes = {
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
