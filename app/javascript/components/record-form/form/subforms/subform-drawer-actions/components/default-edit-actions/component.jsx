import PropTypes from "prop-types";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CloseIcon from "@material-ui/icons/Close";

import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";
import css from "../../styles.css";

function Component({ handleBack, handleBackLabel, handleCancel, handleSuccess }) {
  return (
    <div className={css.buttonsRow}>
      {handleBack && (
        <ActionButton
          id="dialog-submit"
          icon={<ArrowBackIosIcon />}
          text={handleBackLabel}
          type={ACTION_BUTTON_TYPES.default}
          outlined
          noTranslate
          rest={{
            ...(handleBack && { onClick: handleSuccess })
          }}
        />
      )}
      {handleCancel && (
        <ActionButton
          icon={<CloseIcon />}
          text="cancel"
          type={ACTION_BUTTON_TYPES.default}
          outlined
          cancel
          rest={{
            onClick: handleCancel
          }}
        />
      )}
    </div>
  );
}

Component.displayName = "EditActions";

Component.propTypes = {
  handleBack: PropTypes.func,
  handleBackLabel: PropTypes.string,
  handleCancel: PropTypes.func,
  handleSuccess: PropTypes.func
};

export default Component;
