import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch } from "react-redux";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";
import { PageHeading, PageContent } from "../page";
import ActionButton from "../action-button";
import { CREATE_RECORDS, RESOURCES } from "../../libs/permissions";
import { usePermissions } from "../user";
import { fetchIncidentFromCase } from "../records";

import styles from "./styles.css";
import { NAME } from "./constants";
import IncidentPanel from "./components/panel";

const Container = ({ record, incidents, mobileDisplay, handleToggleNav }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const canAddIncidents = usePermissions(RESOURCES.incidents, CREATE_RECORDS);

  const renderIncidents =
    incidents &&
    incidents.map(incident => (
      <IncidentPanel key={incident.get("unique_id")} incidentCaseId={record.get("id")} incident={incident} css={css} />
    ));

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
      <div key="incindents-from-case-div">
        <PageHeading title={i18n.t("incidents.label")}>{newIncidentBtn}</PageHeading>
        <div className={css.pageContent}>
          <PageContent>{renderIncidents}</PageContent>
        </div>
        {/* <RecordFormTitle
          mobileDisplay={mobileDisplay}
          handleToggleNav={handleToggleNav}
          displayText={i18n.t("incidents.label")}
        />
        <div>{newUserBtn}</div> */}
        {/* {renderIncidents} */}
      </div>
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
