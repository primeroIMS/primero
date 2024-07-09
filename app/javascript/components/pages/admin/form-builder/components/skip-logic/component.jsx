// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useCallback } from "react";
import PropTypes from "prop-types";

import { MAX_CONDITIONS } from "../../../../../../config";
import { useDialog } from "../../../../../action-dialog";
import { useI18n } from "../../../../../i18n";
import { FORM_MODE_NEW } from "../../../../../form";
import ConditionList from "../condition-list";
import ConditionDialog from "../condition-dialog";
import { NAME as CONDITIONS_DIALOG } from "../condition-dialog/constants";
import { buildFieldName } from "../condition-dialog/utils";

function Component({
  fieldProps = {},
  formMethods,
  handleClose,
  handleSuccess,
  isNested,
  primeroModule,
  recordType,
  title
}) {
  const i18n = useI18n();
  const { setDialog } = useDialog(CONDITIONS_DIALOG);

  const onAddRecordCondition = useCallback(() => {
    setDialog({ dialog: CONDITIONS_DIALOG, open: true, params: { mode: FORM_MODE_NEW, initialValues: {} } });
  }, []);

  const onAddSubformCondition = useCallback(() => {
    setDialog({
      dialog: CONDITIONS_DIALOG,
      open: true,
      params: { mode: FORM_MODE_NEW, initialValues: {}, isNested: true }
    });
  }, []);

  const recordFieldName = buildFieldName(fieldProps.name, false);
  const subformFieldName = buildFieldName(fieldProps.name, true);

  const displayConditions = formMethods.getValues(recordFieldName) || [];
  const displayConditionsSubform = formMethods.getValues(subformFieldName) || [];
  const showAddCondition = displayConditions.length + displayConditionsSubform.length < MAX_CONDITIONS;

  const addRecordButtonProps = {
    disabled: !showAddCondition,
    text: isNested
      ? i18n.t("fields.skip_logic.record_section.buttons.add")
      : i18n.t("forms.skip_logic.section.buttons.add"),
    onClick: onAddRecordCondition
  };

  const addSubformButtonProps = {
    disabled: !showAddCondition,
    text: i18n.t("fields.skip_logic.subform_section.buttons.add"),
    onClick: onAddSubformCondition
  };

  return (
    <>
      <ConditionList
        formMethods={formMethods}
        fieldName={recordFieldName}
        title={title || i18n.t("forms.skip_logic.section.title")}
        hasNestedConditions={isNested && displayConditionsSubform.length > 0}
        addButtonProps={addRecordButtonProps}
      />
      {isNested && (
        <ConditionList
          formMethods={formMethods}
          fieldName={subformFieldName}
          title={i18n.t("fields.skip_logic.subform_section.title")}
          isNested
          addButtonProps={addSubformButtonProps}
        />
      )}
      <ConditionDialog
        fieldProps={fieldProps}
        formMethods={formMethods}
        primeroModule={primeroModule}
        recordType={recordType}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    </>
  );
}

Component.displayName = "SkipLogic";

Component.propTypes = {
  fieldProps: PropTypes.shape({
    formSectionId: PropTypes.number,
    name: PropTypes.string
  }),
  formMethods: PropTypes.object,
  handleClose: PropTypes.func,
  handleSuccess: PropTypes.func,
  isNested: PropTypes.bool,
  primeroModule: PropTypes.string,
  recordType: PropTypes.string,
  title: PropTypes.string
};

export default Component;
