import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { List } from "@material-ui/core";
import { useDispatch } from "react-redux";
import NavGroup from "./NavGroup";
import { setSelectedForm } from "../action-creators";

const Nav = ({ formNav, selectedForm, firstTab }) => {
  const [open, setOpen] = useState({});
  const dispatch = useDispatch();

  const handleClick = args => {
    const { group, formId } = args;

    if (group) {
      setOpen(Object.assign({}, open, { [group]: !open[group] }));
    }

    dispatch(setSelectedForm(formId));
  };

  useEffect(() => {
    dispatch(setSelectedForm(firstTab));
  }, [firstTab]);

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
  selectedForm: PropTypes.string,
  firstTab: PropTypes.string
};

export default Nav;
