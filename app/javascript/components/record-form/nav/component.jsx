// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable camelcase */

import { useState, useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { List, Drawer } from "@mui/material";
import { useDispatch } from "react-redux";
import Divider from "@mui/material/Divider";
import { useHistory } from "react-router-dom";

import { useI18n } from "../../i18n";
import { INCIDENT_FROM_CASE, RECORD_INFORMATION_GROUP, RECORD_TYPES, RECORD_OWNER } from "../../../config";
import {
  getIncidentFromCaseForm,
  getPreviousRecordType,
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
import { RecordInformation } from "./components";
import css from "./styles.css";
import CloseButtonNavBar from "./components/close-button-nav-bar";
import FormGroup from "./components/form-groups";

const Component = ({
  firstTab,
  formNav,
  hasForms,
  handleToggleNav,
  isNew,
  isShow,
  mobileDisplay,
  recordType,
  recordId,
  selectedRecord,
  toggleNav,
  primeroModule,
  selectedForm,
  formikValuesForNav
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const history = useHistory();

  const [open, setOpen] = useState("");
  const [previousGroup, setPreviousGroup] = useState("");
  const [selectedRecordChanged, setSelectedRecordChanged] = useState(false);

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
  const recordInformationFormIds = useMemoizedSelector(state =>
    getRecordInformationFormIds(state, { recordType: RECORD_TYPES[recordType], primeroModule })
  );
  const previousRecordType = useMemoizedSelector(state => getPreviousRecordType(state));
  const selectedRecordId = useMemoizedSelector(state => getSelectedRecord(state, recordType));

  const formGroupLookup = useOptions({
    source: buildFormGroupUniqueId(primeroModule, RECORD_TYPES[recordType].replace("_", "-"))
  });

  const firstSelectedForm = selectedRecordForm?.first();

  const handleClick = useCallback(
    args => {
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
    },
    [mobileDisplay, dispatch, open, previousGroup]
  );

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

  useEffect(() => {
    if (recordId && selectedRecordId && selectedRecordId !== recordId && isShow) {
      setSelectedRecordChanged(true);
    }
  }, [selectedRecord, isShow, recordId]);

  useEffect(() => {
    if (selectedRecordChanged && isShow && firstTab) {
      dispatch(setSelectedForm(firstTab.unique_id));
      setSelectedRecordChanged(false);
    }
  }, [selectedRecordChanged, isShow, firstTab]);

  useEffect(() => {
    if (firstTab && recordType && previousRecordType && recordType !== previousRecordType) {
      dispatch(setSelectedForm(firstTab.unique_id));
    }
  }, [recordType, previousRecordType, firstTab]);

  const drawerClasses = { paper: css.drawerPaper };

  if (!formNav) return null;

  const [...formGroups] = formNav.values();

  return (
    <>
      <ConditionalWrapper
        condition={mobileDisplay}
        wrapper={Drawer}
        anchor="left"
        open={toggleNav}
        onClose={handleToggleNav}
        classes={drawerClasses}
      >
        <CloseButtonNavBar handleToggleNav={handleToggleNav} mobileDisplay={mobileDisplay} />
        <List data-testid="nav-list" className={css.listRecordNav}>
          <RecordInformation
            handleClick={handleClick}
            open={open}
            recordAlerts={recordAlerts}
            selectedForm={selectedForm}
            formGroupLookup={formGroupLookup}
            primeroModule={primeroModule}
          />
          <Divider />
          {formGroups.map(formGroup => (
            <FormGroup
              formikValuesForNav={formikValuesForNav}
              handleClick={handleClick}
              isNew={isNew}
              open={open}
              recordAlerts={recordAlerts}
              selectedForm={selectedForm}
              validationErrors={validationErrors}
              formGroupLookup={formGroupLookup}
              formGroup={formGroup}
              key={formGroup.keySeq().first()}
            />
          ))}
        </List>
      </ConditionalWrapper>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  firstTab: PropTypes.object,
  formikValuesForNav: PropTypes.object,
  formNav: PropTypes.object,
  handleToggleNav: PropTypes.func.isRequired,
  hasForms: PropTypes.bool,
  isNew: PropTypes.bool,
  isShow: PropTypes.bool,
  mobileDisplay: PropTypes.bool.isRequired,
  primeroModule: PropTypes.string,
  recordId: PropTypes.string,
  recordType: PropTypes.string,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedRecord: PropTypes.string,
  toggleNav: PropTypes.bool
};

export default memo(Component, (prev, next) => {
  const { formNav: prevFormNav, ...restPrev } = prev;
  const { formNav: nextFormNav, ...restNext } = next;

  return restPrev === restNext && prevFormNav.equals(nextFormNav);
});
