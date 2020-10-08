import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch } from "react-redux";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";
import ActionButton from "../action-button";
import { CREATE_INCIDENT, RESOURCES } from "../../libs/permissions";
import { usePermissions } from "../user";
import { fetchIncidentFromCase } from "../records";

import styles from "./styles.css";
import { NAME } from "./constants";
import IncidentPanel from "./components/panel";

const Container = ({ record, incidents, mobileDisplay, handleToggleNav }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const canAddIncidents = usePermissions(RESOURCES.cases, CREATE_INCIDENT);

  const renderIncidents =
    incidents &&
    incidents.map(incident => <IncidentPanel key={incident.get("unique_id")} incident={incident} css={css} />);

  const handleCreateIncident = () => {
    dispatch(fetchIncidentFromCase(record.get("id"), record.get("module_id")));
  };
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
      {renderIncidents}
    </div>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  handleToggleNav: PropTypes.func.isRequired,
  incidents: PropTypes.object,
  mobileDisplay: PropTypes.bool.isRequired,
  record: PropTypes.object
};
export default Container;
