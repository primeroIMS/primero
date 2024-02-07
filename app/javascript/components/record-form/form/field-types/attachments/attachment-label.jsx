// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { FormHelperText } from "@material-ui/core/";

import css from "../../styles.css";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";

const AttachmentLabel = ({ label, helpText, disabled, mode, arrayHelpers, handleAttachmentAddition }) => {
  const isDisabled = !disabled && !mode.isShow;
  const onClick = () => handleAttachmentAddition(arrayHelpers);

  return (
    <div className={css.attachmentHeading}>
      <div className={css.attachmentLabel}>
        <h4>{label}</h4>
        <FormHelperText>{helpText}</FormHelperText>
      </div>
      {isDisabled && (
        <div>
          <ActionButton
            icon={<AddIcon />}
            text="Add"
            type={ACTION_BUTTON_TYPES.icon}
            rest={{
              onClick
            }}
          />
        </div>
      )}
    </div>
  );
};

AttachmentLabel.displayName = "AttachmentLabel";

AttachmentLabel.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  handleAttachmentAddition: PropTypes.func.isRequired,
  helpText: PropTypes.string,
  label: PropTypes.string.isRequired,
  mode: PropTypes.object.isRequired
};

export default AttachmentLabel;
