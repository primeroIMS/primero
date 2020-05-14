import React from "react";
import PropTypes from "prop-types";
import NavigationPrompt from "react-router-navigation-prompt";
import { useFormContext } from "react-hook-form";

import ActionDialog from "../../action-dialog";
import { useI18n } from "../../i18n";

const CancelPrompt = ({ useCancelPrompt }) => {
  const i18n = useI18n();
  const { formState, formMode } = useFormContext();
  const { dirty, isSubmitted } = formState;

  const promptCancelWhen = dirty && !isSubmitted && !formMode.get("isShow");

  if (useCancelPrompt) {
    return (
      <NavigationPrompt when={promptCancelWhen}>
        {({ onConfirm, onCancel }) => (
          <ActionDialog
            open
            successHandler={onConfirm}
            cancelHandler={onCancel}
            dialogTitle={i18n.t("record_panel.record_information")}
            dialogText={i18n.t("messages.confirmation_message")}
            confirmButtonLabel={i18n.t("buttons.ok")}
          />
        )}
      </NavigationPrompt>
    );
  }

  return null;
};

CancelPrompt.displayName = "CancelPrompt";

CancelPrompt.propTypes = {
  useCancelPrompt: PropTypes.bool
};

export default CancelPrompt;
