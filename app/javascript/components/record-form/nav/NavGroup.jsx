import React from "react";
import PropTypes from "prop-types";
import { List, Collapse } from "@material-ui/core";

import NavItem from "./NavItem";
import { NAV_GROUP } from "./constants";

const NavGroup = ({
  group,
  handleClick,
  isNew,
  open,
  recordAlerts,
  selectedForm
}) => {
  const [...forms] = group.values();
  const isNested = forms.length > 1;
  const parentForm = forms[0];

  const parentFormProps = {
    form: parentForm,
    name: isNested ? parentForm.groupName : parentForm.name,
    open: open === parentForm.group,
    isNested
  };

  const sharedProps = {
    handleClick,
    isNew,
    itemsOfGroup: forms.map(form => form.formId),
    recordAlerts,
    selectedForm
  };

  return (
    <>
      <NavItem {...parentFormProps} {...sharedProps} />
      {isNested && (
        <Collapse in={open === parentForm.group} timeout="auto" unmountOnExit>
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
  currentUser: PropTypes.string,
  group: PropTypes.object,
  handleClick: PropTypes.func,
  isNew: PropTypes.bool,
  open: PropTypes.string,
  recordAlerts: PropTypes.object,
  recordOwner: PropTypes.string,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default NavGroup;
