import PropTypes from "prop-types";
import NavigationPrompt from "react-router-navigation-prompt";

import ActionDialog from "../../action-dialog";
import { useI18n } from "../../i18n";

const CancelPrompt = ({ useCancelPrompt, dirty, isSubmitted, isShow }) => {
  const i18n = useI18n();

  const promptCancelWhen = dirty && !isSubmitted && !isShow;

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

CancelPrompt.defaultProps = {
  dirty: false,
  isShow: false,
  isSubmitted: false,
  useCancelPrompt: false
};

CancelPrompt.propTypes = {
  dirty: PropTypes.bool,
  isShow: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  useCancelPrompt: PropTypes.bool
};

export default CancelPrompt;
