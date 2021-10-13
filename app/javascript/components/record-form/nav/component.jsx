/* eslint-disable camelcase */

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { List, IconButton, Drawer } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import { useI18n } from "../../i18n";
import { INCIDENT_FROM_CASE, RECORD_INFORMATION_GROUP, RECORD_TYPES, RECORD_OWNER } from "../../../config";
import {
  getIncidentFromCaseForm,
  getRecordFormsByUniqueId,
  getRecordInformationFormIds,
  getValidationErrors
} from "../selectors";
import { getIncidentFromCase, getRecordAlerts, getSelectedRecord } from "../../records";
import { setSelectedForm } from "../action-creators";
import { ConditionalWrapper, useMemoizedSelector } from "../../../libs";
import { buildFormGroupUniqueId } from "../../pages/admin/form-builder/utils";
import useOptions from "../../form/use-options";

import { NAME } from "./constants";
import { NavGroup, RecordInformation } from "./components";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({
  firstTab,
  formNav,
  hasForms,
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
  const css = useStyles();

  const incidentFromCaseForm = useMemoizedSelector(state =>
    getIncidentFromCaseForm(state, { recordType, i18n, primeroModule })
  );
  const incidentFromCase = useMemoizedSelector(state => getIncidentFromCase(state, recordType));
  const validationErrors = useMemoizedSelector(state => getValidationErrors(state));
  const currentSelectedRecord = useMemoizedSelector(state => getSelectedRecord(state, recordType));
  const recordAlerts = useMemoizedSelector(state => getRecordAlerts(state, recordType));
  const selectedRecordForm = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule,
      formName: selectedForm || firstTab?.unique_id,
      checkVisible: true
    })
  );

  const formGroupLookup = useOptions({
    source: buildFormGroupUniqueId(primeroModule, RECORD_TYPES[recordType].replace("_", "-"))
  });

  const recordInformationFormIds = useMemoizedSelector(state =>
    getRecordInformationFormIds(state, { recordType: RECORD_TYPES[recordType], primeroModule })
  );

  const firstSelectedForm = selectedRecordForm?.first();

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

  const handleWithoutSelectedForm = () => {
    dispatch(setSelectedForm(firstTab.unique_id));
    if (currentSelectedRecord !== selectedRecord) {
      setOpen(firstTab.form_group_id);
    } else if (!selectedRecordForm?.isEmpty() && open !== selectedRecordForm.first().form_group_id) {
      setOpen(selectedRecordForm.first().form_group_id);
    }
  };

  const handleFirstTab = () => {
    if (!selectedForm && firstTab) {
      handleWithoutSelectedForm();
    } else if (!selectedRecordForm?.isEmpty()) {
      setOpen(selectedRecordForm.first().form_group_id);
    } else if (recordInformationFormIds.includes(selectedForm)) {
      setOpen(RECORD_INFORMATION_GROUP);
    } else if (firstTab) {
      dispatch(setSelectedForm(firstTab.unique_id));
      setOpen(firstTab.form_group_id);
    }
  };

  useEffect(() => {
    if (isNew && !selectedForm && firstTab) {
      dispatch(setSelectedForm(firstTab.unique_id));
      setOpen(firstTab.form_group_id);
    }
  }, []);

  useEffect(() => {
    if (!hasForms && !selectedForm) {
      dispatch(setSelectedForm(RECORD_OWNER));
      setOpen(RECORD_INFORMATION_GROUP);
    }
    if (hasForms && selectedForm === RECORD_OWNER && firstTab.unique_id !== RECORD_OWNER) {
      dispatch(setSelectedForm(firstTab.unique_id));
    }
  }, [hasForms]);

  useEffect(() => {
    if (hasForms) {
      handleFirstTab();
    }
  }, [firstSelectedForm?.form_group_id, hasForms]);

  useEffect(() => {
    // If we are going back
    if (history.action === "POP") {
      if (selectedForm && recordInformationFormIds.includes(selectedForm)) {
        setOpen(RECORD_INFORMATION_GROUP);
      } else if (incidentFromCase?.size && recordInformationFormIds.includes(INCIDENT_FROM_CASE)) {
        dispatch(setSelectedForm(INCIDENT_FROM_CASE));
        setOpen(incidentFromCaseForm.form_group_id);
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
          formGroupLookup={formGroupLookup}
        />
      );
    });

    return (
      <>
        <ConditionalWrapper condition={mobileDisplay} wrapper={Drawer} {...drawerProps}>
          {renderCloseButtonNavBar}
          <List className={css.listRecordNav}>
            <RecordInformation
              handleClick={handleClick}
              open={open}
              recordAlerts={recordAlerts}
              selectedForm={selectedForm}
              formGroupLookup={formGroupLookup}
              primeroModule={primeroModule}
            />
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
  hasForms: PropTypes.bool,
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
