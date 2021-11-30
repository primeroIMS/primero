import PropTypes from "prop-types";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CloseIcon from "@material-ui/icons/Close";

import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ handleBack, handleCancel }) => {
  const handleSuccess = event => {
    event.stopPropagation();
    handleBack();
    // handleCancel();
  };

  return (
    <div className={css.buttonsRow}>
      {handleBack && (
        <ActionButton
          icon={<ArrowBackIosIcon />}
          text="incident.violation.back_to_violations"
          type={ACTION_BUTTON_TYPES.default}
          autoFocus
          outlined
          rest={{
            onClick: handleSuccess
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
};

Component.propTypes = {
  handleBack: PropTypes.func,
  handleCancel: PropTypes.func
};

Component.displayName = NAME;

export default Component;
