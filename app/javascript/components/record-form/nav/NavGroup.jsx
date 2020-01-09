import React from "react";
import PropTypes from "prop-types";
import { List, Collapse } from "@material-ui/core";

import NavItem from "./NavItem";
import { NAV_GROUP } from "./constants";

const NavGroup = ({ group, open, handleClick, selectedForm }) => {
  const [...forms] = group.values();
  const isNested = forms.length > 1;
  const parentForm = forms[0];

  const parentFormProps = {
    form: parentForm,
    name: isNested ? parentForm.groupName : parentForm.name,
    open: open[parentForm.group],
    isNested
  };

  const sharedProps = {
    handleClick,
    selectedForm
  };

  return (
    <>
      <NavItem {...parentFormProps} {...sharedProps} />
      {isNested && (
        <Collapse in={open[parentForm.group]} timeout="auto" unmountOnExit>
          <List disablePadding dense>
            {forms.map(f => (
              <NavItem
                form={f}
                name={f.name}
                key={f.formId}
                groupItem
                {...sharedProps}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

NavGroup.displayName = NAV_GROUP;

NavGroup.propTypes = {
  group: PropTypes.object,
  handleClick: PropTypes.func,
  open: PropTypes.object,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default NavGroup;
