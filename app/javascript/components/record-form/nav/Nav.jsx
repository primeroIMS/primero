import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { List } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Divider from "@material-ui/core/Divider";

import { setSelectedForm } from "../action-creators";

import { NAME } from "./constants";
import NavGroup from "./NavGroup";
import RecordInformation from "./parts/record-information";

const Nav = ({
  formNav,
  selectedForm,
  firstTab,
  handleToggleNav,
  mobileDisplay
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

  useEffect(() => {
    dispatch(setSelectedForm(firstTab.unique_id));

    setOpen({
      ...open,
      [firstTab.form_group_id]: !open[firstTab.form_group_id]
    });
  }, []);

  if (formNav) {
    const [...formGroups] = formNav.values();

    return (
      <List>
        <RecordInformation handleClick={handleClick} open={open} />
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
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Nav;
