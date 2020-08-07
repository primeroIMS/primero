/* eslint-disable camelcase */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { List, IconButton, Drawer } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

import { RECORD_TYPES } from "../../../config";
import {
  getRecordFormsByUniqueId,
  getSelectedRecord,
  getValidationErrors
} from "../selectors";
import { getRecordAlerts } from "../../records/selectors";
import { setSelectedForm, setSelectedRecord } from "../action-creators";
import { compare, ConditionalWrapper } from "../../../libs";

import { NAME } from "./constants";
import { NavGroup, RecordInformation } from "./components";
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
  selectedForm
}) => {
  const [open, setOpen] = useState("");
  const [previousGroup, setPreviousGroup] = useState("");
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
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
  const validationErrors = useSelector(
    state => getValidationErrors(state),
    compare
  );
  const currentSelectedRecord = useSelector(state => getSelectedRecord(state));

  const recordAlerts = useSelector(
    state => getRecordAlerts(state, recordType),
    compare
  );

  const handleClick = args => {
    const { group, formId, parentItem } = args;

    setPreviousGroup(group);
    if (group !== open) {
      setOpen(group);
    } else if (parentItem && group === open) {
      setOpen("");
    }

    if (parentItem) {
      if (
        (open === "" || group === open) &&
        (previousGroup === "" || previousGroup === group)
      ) {
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
    if (isNew) {
      dispatch(setSelectedForm(firstTab.unique_id));
    } else if (!selectedForm) {
      if (currentSelectedRecord !== selectedRecord) {
        dispatch(setSelectedForm(firstTab.unique_id));
      } else if (
        !selectedRecordForm?.isEmpty() &&
        open !== selectedRecordForm.first().form_group_id
      ) {
        setOpen(selectedRecordForm.first().form_group_id);
      }
    } else if (!selectedRecordForm?.isEmpty()) {
      setOpen(selectedRecordForm.first().form_group_id);
    }
  }, []);

  useEffect(() => {
    dispatch(setSelectedRecord(selectedRecord));

    if (!selectedForm || isNew || currentSelectedRecord !== selectedRecord) {
      setOpen(firstTab.form_group_id);
    }
  }, [firstTab]);

  const renderCloseButtonNavBar = mobileDisplay && (
    <div className={css.closeButtonRecordNav}>
      <IconButton
        onClick={handleToggleNav}
        className={css.closeIconButtonRecordNav}
      >
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
        <ConditionalWrapper
          condition={mobileDisplay}
          wrapper={Drawer}
          {...drawerProps}
        >
          {renderCloseButtonNavBar}
          <List className={css.listRecordNav}>
            <RecordInformation
              handleClick={handleClick}
              open={open}
              selectedForm={selectedForm}
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
  isNew: PropTypes.bool,
  mobileDisplay: PropTypes.bool.isRequired,
  primeroModule: PropTypes.string,
  recordType: PropTypes.string,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedRecord: PropTypes.string,
  toggleNav: PropTypes.bool
};

export default Component;
