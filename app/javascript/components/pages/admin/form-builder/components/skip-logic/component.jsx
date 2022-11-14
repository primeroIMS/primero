import { useCallback } from "react";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";

import { MAX_CONDITIONS } from "../../../../../../config";
import { useDialog } from "../../../../../action-dialog";
import { useI18n } from "../../../../../i18n";
import ActionButton from "../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";
import { FORM_MODE_NEW } from "../../../../../form";
import ConditionList from "../condition-list";
import ConditionDialog from "../condition-dialog";
import { NAME as CONDITIONS_DIALOG } from "../condition-dialog/constants";

function Component({ field, formMethods, handleClose, handleSuccess, primeroModule, recordType }) {
  const i18n = useI18n();
  const { setDialog } = useDialog(CONDITIONS_DIALOG);

  const onAddCondition = useCallback(() => {
    setDialog({ dialog: CONDITIONS_DIALOG, open: true, params: { mode: FORM_MODE_NEW, initialValues: {} } });
  }, []);

  const conditionsFieldName = field ? `${field.get("name")}.display_conditions_record` : "display_conditions";
  const displayConditions = formMethods.getValues(conditionsFieldName) || [];
  const displayConditionsSubform = formMethods.getValues(`${field?.get("name")}.display_conditions_subform`) || [];
  const showAddCondition = displayConditions.length + displayConditionsSubform.length < MAX_CONDITIONS;

  return (
    <>
      <h1>{i18n.t("forms.skip_logic_title")}</h1>
      <ConditionList formMethods={formMethods} field={field} />
      <ConditionDialog
        field={field}
        formMethods={formMethods}
        primeroModule={primeroModule}
        recordType={recordType}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
      <ActionButton
        id="add-skip-logic"
        icon={<AddIcon />}
        text={i18n.t("forms.conditions.add")}
        type={ACTION_BUTTON_TYPES.default}
        noTranslate
        disabled={!showAddCondition}
        rest={{ onClick: onAddCondition }}
      />
    </>
  );
}

Component.displayName = "SkipLogic";

Component.propTypes = {
  field: PropTypes.number,
  formMethods: PropTypes.object,
  handleClose: PropTypes.func,
  handleSuccess: PropTypes.func,
  primeroModule: PropTypes.string,
  recordType: PropTypes.string
};

export default Component;
