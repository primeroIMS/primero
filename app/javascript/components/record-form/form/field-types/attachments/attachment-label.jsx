// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { FormHelperText } from "@material-ui/core/";

import css from "../../styles.css";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";

const AttachmentLabel = ({ label, helpText, disabled, mode, arrayHelpers, handleAttachmentAddition, error }) => {
  const isDisabled = !disabled && !mode.isShow;
  const onClick = () => handleAttachmentAddition(arrayHelpers);

  return (
    <div className={css.attachmentHeading}>
      <div className={css.attachmentLabel}>
        <h4 data-testid="attachment-label">{label}</h4>
        <FormHelperText data-testid="attachment-label-helptext" error={Boolean(error)}>
          {error || helpText}
        </FormHelperText>
      </div>
      {isDisabled && (
        <div>
          <ActionButton
            icon={<AddIcon />}
            text="Add"
            type={ACTION_BUTTON_TYPES.icon}
            data-testid="attachment-label-action-button"
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
  error: PropTypes.string,
  handleAttachmentAddition: PropTypes.func.isRequired,
  helpText: PropTypes.string,
  label: PropTypes.string.isRequired,
  mode: PropTypes.object.isRequired
};

export default AttachmentLabel;
