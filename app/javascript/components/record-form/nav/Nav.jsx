import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { List } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import Divider from "@material-ui/core/Divider";

import { getSelectedRecord, getRecordAlerts } from "../selectors";
import { setSelectedForm, setSelectedRecord } from "../action-creators";

import { NAME } from "./constants";
import NavGroup from "./NavGroup";
import RecordInformation from "./components/record-information";

const Nav = ({
  firstTab,
  formNav,
  handleToggleNav,
  isNew,
  mobileDisplay,
  selectedForm,
  selectedRecord
}) => {
  const [open, setOpen] = useState({});
  const dispatch = useDispatch();

  const handleClick = args => {
    const { group, formId, parentItem } = args;

    if (group) {
      setOpen({ ...open, [group]: !open[group] });
    }

    if (!parentItem) {
      dispatch(setSelectedForm(formId));

      if (mobileDisplay) {
        handleToggleNav();
      }
    }
  };

  const storedRecord = useSelector(state => getSelectedRecord(state));

  useEffect(() => {
    if (!selectedRecord || selectedRecord !== storedRecord) {
      dispatch(setSelectedForm(firstTab.unique_id));
    }

    dispatch(setSelectedRecord(selectedRecord));

    setOpen({
      ...open,
      [firstTab.form_group_id]: !open[firstTab.form_group_id]
    });
  }, [firstTab]);

  const recordAlerts = useSelector(state => getRecordAlerts(state));

  if (formNav) {
    const [...formGroups] = formNav.values();

    const renderFormGroups = formGroups.map(formGroup => {
      return (
        <NavGroup
          group={formGroup}
          handleClick={handleClick}
          isNew={isNew}
          key={formGroup.first().formId}
          open={open}
          recordAlerts={recordAlerts}
          selectedForm={selectedForm}
        />
      );
    });

    return (
      <List>
        <RecordInformation
          handleClick={handleClick}
          open={open}
          selectedForm={selectedForm}
        />
        <Divider />
        {renderFormGroups}
      </List>
    );
  }

  return null;
};

Nav.displayName = NAME;

Nav.propTypes = {
  firstTab: PropTypes.object,
  formNav: PropTypes.object,
  handleToggleNav: PropTypes.func.isRequired,
  isNew: PropTypes.bool,
  mobileDisplay: PropTypes.bool.isRequired,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedRecord: PropTypes.string
};

export default Nav;
