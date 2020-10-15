import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CreateIcon from "@material-ui/icons/Create";
import { batch, useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { READ_RECORDS, RESOURCES, WRITE_RECORDS } from "../../../../libs/permissions";
import { usePermissions } from "../../../user";
import { useI18n } from "../../../i18n";
import { NAME_DETAIL } from "../../constants";
import DisplayData from "../../../display-data";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { setSelectedForm } from "../../../record-form/action-creators";
import { setCaseIdForIncident } from "../../../records/action-creators";

const Component = ({
  css,
  incidentCaseId,
  incidentCaseIdDisplay,
  incidentDateInterview,
  incidentDate,
  incidentUniqueID,
  incidentType
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const canViewIncidents = usePermissions(RESOURCES.incidents, READ_RECORDS);
  const canEditIncidents = usePermissions(RESOURCES.incidents, WRITE_RECORDS);
  const incidentInterviewLabel = i18n.t("incidents.date_of_interview");
  const incidentDateLabel = i18n.t("incidents.date_of_incident");
  const incidentTypeLabel = i18n.t("incidents.type_violence");
  const handleView = () => {
    batch(() => {
      dispatch(setSelectedForm(null));
      dispatch(setCaseIdForIncident(incidentCaseId, incidentCaseIdDisplay));
      dispatch(push(`/${RESOURCES.incidents}/${incidentUniqueID}`));
    });
  };
  const handleEdit = () => {
    batch(() => {
      dispatch(setSelectedForm(null));
      dispatch(setCaseIdForIncident(incidentCaseId, incidentCaseIdDisplay));
      dispatch(push(`/${RESOURCES.incidents}/${incidentUniqueID}/edit`));
    });
  };

  const viewIncidentBtn = canViewIncidents && (
    <ActionButton
      icon={<VisibilityIcon />}
      text={i18n.t("buttons.view")}
      type={ACTION_BUTTON_TYPES.default}
      outlined
      rest={{
        onClick: handleView
      }}
    />
  );
  const editIncidentBtn = canEditIncidents && (
    <ActionButton
      icon={<CreateIcon />}
      text={i18n.t("buttons.edit")}
      type={ACTION_BUTTON_TYPES.default}
      outlined
      rest={{
        onClick: handleEdit
      }}
    />
  );

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={9} xs={12}>
          <Grid item md={12} xs={12}>
            <div className={css.spaceGrid}>
              <DisplayData label={incidentInterviewLabel} value={incidentDateInterview} />
            </div>
          </Grid>
          <Grid item md={12} xs={12}>
            <div className={css.spaceGrid}>
              <DisplayData label={incidentDateLabel} value={incidentDate} />
            </div>
          </Grid>
          <Grid item md={12} xs={12}>
            <div className={css.spaceGrid}>
              <DisplayData label={incidentTypeLabel} value={incidentType} />
            </div>
          </Grid>
        </Grid>
        <Grid item md={3} xs={12}>
          <div className={css.buttonsActions}>
            {viewIncidentBtn}
            {editIncidentBtn}
          </div>
        </Grid>
      </Grid>
    </>
  );
};

Component.displayName = NAME_DETAIL;

Component.propTypes = {
  css: PropTypes.object.isRequired,
  incidentCaseId: PropTypes.string,
  incidentCaseIdDisplay: PropTypes.string,
  incidentDate: PropTypes.string,
  incidentDateInterview: PropTypes.string,
  incidentType: PropTypes.node,
  incidentUniqueID: PropTypes.string
};
export default Component;
