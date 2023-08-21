// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { Button, Menu, MenuItem } from "@material-ui/core";

import { useThemeHelper } from "../../../../../libs";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import { useI18n } from "../../../../i18n";
import { buildViolationAssociationsOptions } from "../../utils";
import { VIOLATIONS_ASSOCIATIONS_RESPONSES } from "../../../../../config";
import css from "../styles.css";

import { NAME, NEW } from "./constants";

const Component = ({
  arrayHelpers,
  field,
  formik,
  mode,
  formSection,
  isReadWriteForm,
  isDisabled,
  isViolationAssociation,
  setOpenDialog,
  setDialogIsNew,
  parentTitle,
  parentValues
}) => {
  const i18n = useI18n();
  const [anchorEl, setAnchorEl] = useState(null);
  const { mobileDisplay } = useThemeHelper();
  const renderAddText = !mobileDisplay ? i18n.t("fields.add") : null;
  const shouldRenderViolationAssociationMenu =
    isViolationAssociation && field.name !== VIOLATIONS_ASSOCIATIONS_RESPONSES && Boolean(parentTitle);

  if (mode.isShow || isDisabled || !isReadWriteForm) {
    return null;
  }

  const associationOptions = shouldRenderViolationAssociationMenu
    ? buildViolationAssociationsOptions({
        fieldName: field.name,
        formikValues: formik.values,
        parentValues,
        collapsedFields: formSection.collapsed_field_names,
        fields: formSection.fields,
        i18n
      })
    : [];

  const handleAddSubform = event => {
    event.stopPropagation();
    if (shouldRenderViolationAssociationMenu) {
      setAnchorEl(event.currentTarget);

      return;
    }
    setDialogIsNew(true);
    setOpenDialog({ open: true, index: null });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnClickMenuItem = event => {
    setAnchorEl(null);

    const subformId = event.currentTarget.value;

    if (subformId === NEW) {
      setDialogIsNew(true);
      setOpenDialog({ open: true, index: null });

      return;
    }
    const violationAssociationObj = parentValues[field.name].find(val => val.unique_id === subformId);

    arrayHelpers.push({
      ...violationAssociationObj,
      violations_ids: [...violationAssociationObj.violations_ids, formik.values.unique_id]
    });
  };

  return (
    <div data-testid="subForm-add-entry">
      <ActionButton
        id="fields.add"
        data-testid="fields-add"
        icon={<AddIcon />}
        text={renderAddText}
        type={ACTION_BUTTON_TYPES.default}
        noTranslate
        rest={{
          onClick: handleAddSubform
        }}
      />
      {shouldRenderViolationAssociationMenu && (
        <Menu data-testid="menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          {associationOptions.map(option => {
            return (
              <MenuItem
                data-testid="menu-item"
                key={option.id}
                component={Button}
                value={option.id}
                onClick={handleOnClickMenuItem}
                fullWidth
                classes={{ root: css.violationMenu }}
              >
                <div className={css.listItemText}>{option.value}</div>
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
  isReadWriteForm: PropTypes.bool,
  isViolationAssociation: PropTypes.bool,
  mode: PropTypes.object.isRequired,
  parentTitle: PropTypes.string,
  parentValues: PropTypes.object,
  setDialogIsNew: PropTypes.func.isRequired,
  setOpenDialog: PropTypes.func.isRequired
};

export default Component;
