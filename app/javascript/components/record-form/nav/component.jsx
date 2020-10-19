/* eslint-disable camelcase */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { List, IconButton, Drawer } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import { useI18n } from "../../i18n";
import { INCIDENT_FROM_CASE, RECORD_TYPES } from "../../../config";
import { getRecordFormsByUniqueId, getSelectedRecord, getValidationErrors } from "../selectors";
import { getIncidentFromCase, getRecordAlerts } from "../../records/selectors";
import { setSelectedForm, setSelectedRecord } from "../action-creators";
import { compare, ConditionalWrapper } from "../../../libs";

import { NAME } from "./constants";
import { NavGroup, RecordInformation } from "./components";
import { getRecordInformationFormIds, RECORD_INFORMATION_GROUP } from "./components/record-information";
import styles from "./styles.css";

const Component = ({
  firstTab,
  formNav,
  handleToggleNav,
  isNew,
  mobileDisplay,
  recordType,
  selectedRecord,
  toggleNav,
  primeroModule,
  selectedForm,
  history
}) => {
  const i18n = useI18n();
  const [open, setOpen] = useState("");
  const [previousGroup, setPreviousGroup] = useState("");
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const incidentFromCase = useSelector(state => getIncidentFromCase(state, recordType));
  const recordInformationFormIds = getRecordInformationFormIds(i18n, RECORD_TYPES[recordType]);
  const selectedRecordForm = useSelector(
    state =>
      getRecordFormsByUniqueId(state, {
        recordType: RECORD_TYPES[recordType],
        primeroModule,
        formName: selectedForm || firstTab.unique_id,
        checkVisible: true
      }),
    compare
  );
  const firstSelectedForm = selectedRecordForm?.first();
  const validationErrors = useSelector(state => getValidationErrors(state), compare);
  const currentSelectedRecord = useSelector(state => getSelectedRecord(state));

  const recordAlerts = useSelector(state => getRecordAlerts(state, recordType), compare);

  const handleClick = args => {
    const { group, formId, parentItem } = args;

    setPreviousGroup(group);
    if (group !== open) {
      setOpen(group);
    } else if (parentItem && group === open) {
      setOpen("");
    }

    if (parentItem) {
      if ((open === "" || group === open) && (previousGroup === "" || previousGroup === group)) {
        dispatch(setSelectedForm(selectedForm));
      } else {
        dispatch(setSelectedForm(formId));
      }
    } else {
      dispatch(setSelectedForm(formId));
    }

    if (!parentItem && mobileDisplay) {
      handleToggleNav();
    }
  };

  useEffect(() => {
    if (isNew && !selectedForm) {
      dispatch(setSelectedForm(firstTab.unique_id));
      setOpen(firstTab.form_group_id);
    }
  }, []);

  useEffect(() => {
    if (!selectedForm) {
      dispatch(setSelectedForm(firstTab.unique_id));
      if (currentSelectedRecord !== selectedRecord) {
        setOpen(firstTab.form_group_id);
      } else if (!selectedRecordForm?.isEmpty() && open !== selectedRecordForm.first().form_group_id) {
        setOpen(selectedRecordForm.first().form_group_id);
      }
    } else if (!selectedRecordForm?.isEmpty()) {
      setOpen(selectedRecordForm.first().form_group_id);
    } else if (recordInformationFormIds.includes(selectedForm)) {
      setOpen(RECORD_INFORMATION_GROUP);
    } else {
      dispatch(setSelectedForm(firstTab.unique_id));
      setOpen(firstTab.form_group_id);
    }
  }, [firstSelectedForm?.form_group_id]);

  useEffect(() => {
    dispatch(setSelectedRecord(selectedRecord));
  }, [firstTab]);

  useEffect(() => {
    // If we are going back
    if (history.action === "POP") {
      if (selectedForm && recordInformationFormIds.includes(selectedForm)) {
        setOpen(RECORD_INFORMATION_GROUP);
      } else if (incidentFromCase?.size) {
        dispatch(setSelectedForm(INCIDENT_FROM_CASE));
        setOpen(RECORD_INFORMATION_GROUP);
      } else if (firstSelectedForm?.form_group_id && selectedForm && selectedForm !== firstSelectedForm.unique_id) {
        dispatch(setSelectedForm(firstSelectedForm.unique_id));
        setOpen(firstSelectedForm.form_group_id);
      }
    }
  }, [history.action, firstSelectedForm?.form_group_id]);

  const renderCloseButtonNavBar = mobileDisplay && (
    <div className={css.closeButtonRecordNav}>
      <IconButton onClick={handleToggleNav} className={css.closeIconButtonRecordNav}>
        <CloseIcon />
      </IconButton>
    </div>
  );
  const drawerProps = {
    anchor: "left",
    open: toggleNav,
    onClose: handleToggleNav,
    classes: {
      paper: css.drawerPaper
    }
  };

  if (formNav) {
    const [...formGroups] = formNav.values();

    const renderFormGroups = formGroups.map(formGroup => {
      return (
        <NavGroup
          group={formGroup}
          handleClick={handleClick}
          isNew={isNew}
          open={open}
          key={formGroup.keySeq().first()}
          recordAlerts={recordAlerts}
          selectedForm={selectedForm}
          validationErrors={validationErrors}
        />
      );
    });

    return (
      <>
        <ConditionalWrapper condition={mobileDisplay} wrapper={Drawer} {...drawerProps}>
          {renderCloseButtonNavBar}
          <List className={css.listRecordNav}>
            <RecordInformation handleClick={handleClick} open={open} selectedForm={selectedForm} />
            <Divider />
            {renderFormGroups}
          </List>
        </ConditionalWrapper>
      </>
    );
  }

  return null;
};

Component.displayName = NAME;

Component.propTypes = {
  firstTab: PropTypes.object,
  formNav: PropTypes.object,
  handleToggleNav: PropTypes.func.isRequired,
  history: PropTypes.object,
  isNew: PropTypes.bool,
  mobileDisplay: PropTypes.bool.isRequired,
  primeroModule: PropTypes.string,
  recordType: PropTypes.string,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedRecord: PropTypes.string,
  toggleNav: PropTypes.bool
};

export default withRouter(Component);
