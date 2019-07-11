import React from "react";
import PropTypes from "prop-types";
import { List, Collapse } from "@material-ui/core";
import NavItem from "./NavItem";

const NavGroup = ({ group, open, handleClick, selectedForm }) => {
  const [...forms] = group.values();
  const isNested = forms.length > 1;
  const parentForm = forms[0];

  const parentFormProps = {
    form: parentForm,
    name: parentForm.name,
    open: open[parentForm.group],
    isNested,
    handleClick
  };

  const sharedProps = {
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
                handleClick={handleClick}
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

NavGroup.propTypes = {
  group: PropTypes.object,
  handleClick: PropTypes.func,
  open: PropTypes.object,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default NavGroup;
