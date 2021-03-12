import PropTypes from "prop-types";

import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";

const FormAction = ({ actionHandler, cancel, savingRecord, startIcon, text, disabled, options, tooltip }) => {
  return (
    <ActionButton
      icon={startIcon}
      text={text}
      type={ACTION_BUTTON_TYPES.default}
      pending={savingRecord}
      isCancel={cancel}
      tooltip={tooltip}
      rest={{
        ...(actionHandler && { onClick: actionHandler }),
        disabled: disabled || (savingRecord && !cancel),
        ...options
      }}
    />
  );
};

FormAction.displayName = "FormAction";

FormAction.defaultProps = {
  options: {},
  savingRecord: false
};

FormAction.propTypes = {
  actionHandler: PropTypes.func,
  cancel: PropTypes.bool,
  disabled: PropTypes.bool,
  options: PropTypes.object,
  savingRecord: PropTypes.bool,
  startIcon: PropTypes.object,
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string
};

export default FormAction;
