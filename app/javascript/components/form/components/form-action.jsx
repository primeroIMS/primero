// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";

const FormAction = ({ actionHandler, cancel, savingRecord, startIcon, text, disabled, options, tooltip }) => {
  return (
    <ActionButton
      id="submit-form"
      icon={startIcon}
      text={text}
      type={ACTION_BUTTON_TYPES.default}
      pending={savingRecord}
      cancel={cancel}
      tooltip={tooltip}
      noTranslate
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
