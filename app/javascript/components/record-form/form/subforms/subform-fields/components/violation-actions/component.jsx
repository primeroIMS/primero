import PropTypes from "prop-types";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CloseIcon from "@material-ui/icons/Close";

import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ handleBackLabel, handleBack, handleCancel, isShow }) => {
  const handleSuccess = event => {
    event.stopPropagation();
    handleBack();
  };

  return (
    <div className={css.buttonsRow}>
      {isShow || (
        <>
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
        </>
      )}
    </div>
  );
};

Component.propTypes = {
  handleBack: PropTypes.func,
  handleBackLabel: PropTypes.string,
  handleCancel: PropTypes.func,
  isShow: PropTypes.object
};

Component.displayName = NAME;

export default Component;
