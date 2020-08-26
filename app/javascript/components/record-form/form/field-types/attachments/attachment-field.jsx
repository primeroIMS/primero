import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";

import { useI18n } from "../../../../i18n";
import styles from "../../styles.css";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";

import { buildAttachmentFieldsObject } from "./utils";
import AttachmentInput from "./attachment-input";
import AttachmentPreview from "./attachment-preview";

const AttachmentField = ({ name, index, attachment, disabled, mode, arrayHelpers, value }) => {
  const css = makeStyles(styles)();
  const { attachment_url: attachmentUrl, id, _destroy: destroyed } = value;
  const i18n = useI18n();

  const fields = buildAttachmentFieldsObject(name, index);

  const handleRemove = () => {
    if (attachmentUrl) {
      arrayHelpers.replace(index, {
        _destroy: id,
        attachment_type: attachment
      });
    } else {
      arrayHelpers.remove(index);
    }
  };

  if (destroyed) return null;

  return (
    <Box className={css.uploadBox}>
      <Box display="flex" my={2} alignItems="center">
        <Box flexGrow="1">
          {!mode.isShow && (
            <>
              {attachmentUrl ? (
                <AttachmentPreview attachment={attachment} attachmentUrl={attachmentUrl} />
              ) : (
                <AttachmentInput fields={fields} attachment={attachment} name={name} />
              )}
            </>
          )}
        </Box>
        {disabled && !mode.isShow && (
          <div>
            <ActionButton
              icon={<DeleteIcon />}
              type={ACTION_BUTTON_TYPES.icon}
              isCancel
              rest={{
                "aria-label": i18n.t("buttons.delete"),
                onClick: handleRemove
              }}
            />
          </div>
        )}
      </Box>
    </Box>
  );
};

AttachmentField.displayName = "AttachmentField";

AttachmentField.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  attachment: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  index: PropTypes.number.isRequired,
  mode: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.object
};

export default AttachmentField;
