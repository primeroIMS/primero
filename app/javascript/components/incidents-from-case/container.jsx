import React, { useState } from "react";
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
import RedirectDialog from "./components/redirect-dialog";

const Container = ({ record, incidents, mobileDisplay, handleToggleNav, mode, setFieldValue, handleSubmit }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const canAddIncidents = usePermissions(RESOURCES.cases, CREATE_INCIDENT);

  const renderIncidents =
    incidents &&
    incidents.map(incident => (
      <IncidentPanel
        key={incident.get("unique_id")}
        incidentCaseId={record.get("id")}
        incident={incident}
        css={css}
        mode={mode}
        setFieldValue={setFieldValue}
        handleSubmit={handleSubmit}
      />
    ));
  const handleCreateIncidentBtn = () => {
    if (!mode.isShow) {
      setOpen(true);
    } else {
      dispatch(fetchIncidentFromCase(record.get("id"), record.get("module_id")));
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
  const renderDialog = open && !mode.isShow && (
    <RedirectDialog open setOpen={setOpen} setFieldValue={setFieldValue} handleSubmit={handleSubmit} mode={mode} />
  );

  console.log(renderDialog);

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
  setFieldValue: PropTypes.func
};
export default Container;
