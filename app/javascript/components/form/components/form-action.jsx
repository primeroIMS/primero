import React from "react";
import PropTypes from "prop-types";

import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";

const FormAction = ({ actionHandler, cancel, savingRecord, startIcon, text, disabled, rest }) => {
  return (
    <ActionButton
      icon={startIcon}
      text={text}
      type={ACTION_BUTTON_TYPES.default}
      pending={savingRecord}
      isCancel={cancel}
      rest={{
        onClick: actionHandler,
        disabled: disabled || (savingRecord && !cancel),
        ...rest
      }}
    />
  );
};

FormAction.displayName = "FormAction";

FormAction.defaultProps = {
  savingRecord: false
};

FormAction.propTypes = {
  actionHandler: PropTypes.func.isRequired,
  cancel: PropTypes.bool,
  disabled: PropTypes.bool,
  rest: PropTypes.object,
  savingRecord: PropTypes.bool,
  startIcon: PropTypes.object,
  text: PropTypes.string.isRequired
};

export default FormAction;
