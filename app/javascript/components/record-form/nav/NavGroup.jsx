import React from "react";
import PropTypes from "prop-types";
import { List, Collapse } from "@material-ui/core";
import NavItem from "./NavItem";

const NavGroup = ({ group, open, handleClick, selectedForm }) => {
  const [...forms] = group.values();
  const nested = forms.length > 1;
  const parentForm = forms[0];

  const parentFormProps = {
    form: parentForm,
    open: open[parentForm.group],
    nested,
    handleClick
  };

  return (
    <>
      <NavItem {...parentFormProps} selectedForm={selectedForm} />
      {nested && (
        <Collapse in={open[parentForm.group]} timeout="auto" unmountOnExit>
          <List disablePadding dense>
            {forms.map(f => (
              <NavItem
                form={f}
                handleClick={handleClick}
                key={f.formId}
                selectedForm={selectedForm}
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
  selectedForm: PropTypes.string
};

export default NavGroup;
