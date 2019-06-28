import React, { useState } from "react";
import PropTypes from "prop-types";
import { List } from "@material-ui/core";
import { useDispatch } from "react-redux";
import NavGroup from "./NavGroup";
import { setSelectedForm } from "../action-creators";

const Nav = ({ formNav, selectedForm }) => {
  const [open, setOpen] = useState({});
  const dispatch = useDispatch();

  const handleClick = args => {
    const { group, formId } = args;

    if (group) {
      setOpen(Object.assign({}, open, { [group]: !open[group] }));
    }

    dispatch(setSelectedForm(formId));
  };

  if (formNav) {
    const [...formGroups] = formNav.values();

    return (
      <List>
        {formGroups.map(group => {
          return (
            <NavGroup
              group={group}
              handleClick={handleClick}
              open={open}
              key={group.first().formId}
              selectedForm={selectedForm}
            />
          );
        })}
      </List>
    );
  }

  return null;
};

Nav.propTypes = {
  formNav: PropTypes.object,
  selectedForm: PropTypes.string
};

export default Nav;
