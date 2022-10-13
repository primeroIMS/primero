import { useCallback } from "react";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";

import { useDialog } from "../../../../../action-dialog";
import { useI18n } from "../../../../../i18n";
import ActionButton from "../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";
import { FORM_MODE_NEW } from "../../../../../form";
import ConditionList from "../condition-list";
import ConditionDialog from "../condition-dialog";
import { NAME as CONDITIONS_DIALOG } from "../condition-dialog/constants";

function Component({ formMethods }) {
  const i18n = useI18n();
  const { setDialog } = useDialog(CONDITIONS_DIALOG);

  const onAddCondition = useCallback(() => {
    setDialog({ dialog: CONDITIONS_DIALOG, open: true, params: { mode: FORM_MODE_NEW, initialValues: {} } });
  }, []);

  return (
    <>
      <h1>{i18n.t("forms.skip_logic_title")}</h1>
      <ConditionList formMethods={formMethods} conditionsFieldName="display_conditions" />
      <ConditionDialog formMethods={formMethods} conditionsFieldName="display_conditions" />
      <ActionButton
        id="add-skip-logic"
        icon={<AddIcon />}
        text={i18n.t("forms.conditions.add")}
        type={ACTION_BUTTON_TYPES.default}
        noTranslate
        rest={{ onClick: onAddCondition }}
      />
    </>
  );
}

Component.displayName = "SkipLogic";

Component.propTypes = {
  formMethods: PropTypes.object
};

export default Component;
