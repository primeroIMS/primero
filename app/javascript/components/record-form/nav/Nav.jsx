import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { List } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import Divider from "@material-ui/core/Divider";

import { getSelectedRecord } from "../selectors";
import { setSelectedForm, setSelectedRecord } from "../action-creators";
import { NAME } from "./constants";
import NavGroup from "./NavGroup";
import RecordInformation from "./parts/record-information";

const Nav = ({
  formNav,
  selectedForm,
  firstTab,
  handleToggleNav,
  mobileDisplay,
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

  if (formNav) {
    const [...formGroups] = formNav.values();

    return (
      <List>
        <RecordInformation
          handleClick={handleClick}
          open={open}
          selectedForm={selectedForm}
        />
        <Divider />
        {formGroups.map(g => {
          return (
            <NavGroup
              group={g}
              handleClick={handleClick}
              open={open}
              key={g.first().formId}
              selectedForm={selectedForm}
            />
          );
        })}
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
  mobileDisplay: PropTypes.bool.isRequired,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedRecord: PropTypes.string
};

export default Nav;
