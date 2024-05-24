// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { List, Collapse } from "@material-ui/core";

import NavItem from "../nav-item";
import { useI18n } from "../../../../i18n";

import { NAME } from "./constants";
import { getFormGroupName } from "./utils";

const Component = ({
  group,
  handleClick,
  isNew,
  open,
  recordAlerts,
  selectedForm,
  validationErrors,
  formGroupLookup,
  testID
}) => {
  const [...forms] = group.values();
  const isNested = forms.length > 1;
  const parentForm = forms[0];
  const { group: formGroupID } = parentForm;
  const i18n = useI18n();

  const groupName = getFormGroupName(formGroupLookup, formGroupID);

  const groupHasError = validationErrors?.some(error => error.get("form_group_id") === parentForm.group);

  const formHasError = form => Boolean(validationErrors?.find(error => error.get("unique_id") === form.formId));

  const navItemName = form => (form.i18nName ? i18n.t(form.name) : form.name);

  const parentFormProps = {
    form: parentForm,
    name: isNested ? groupName : navItemName(parentForm),
    open: open === parentForm.group,
    isNested,
    hasError: groupHasError
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
      <NavItem {...parentFormProps} {...sharedProps} testID={testID} />
      {isNested && (
        <Collapse in={open === parentForm.group} timeout="auto" unmountOnExit>
          <List disablePadding dense>
            {forms.map(f => (
              <NavItem
                form={f}
                name={navItemName(f)}
                key={f.formId}
                groupItem
                hasError={formHasError(f)}
                {...sharedProps}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  currentUser: PropTypes.string,
  formGroupLookup: PropTypes.array,
  group: PropTypes.object,
  handleClick: PropTypes.func,
  isNew: PropTypes.bool,
  open: PropTypes.string,
  recordAlerts: PropTypes.object,
  recordOwner: PropTypes.string,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  testID: PropTypes.string,
  validationErrors: PropTypes.object
};

export default Component;
