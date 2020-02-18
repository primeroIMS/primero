import React from "react";
import PropTypes from "prop-types";
import { IconButton, Box } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/styles";

import styles from "../../styles.css";

import { buildAttachmentFieldsObject } from "./utils";
import AttachmentInput from "./attachment-input";

const AttachmentField = ({
  name,
  index,
  attachment,
  disabled,
  mode,
  arrayHelpers,
  value
}) => {
  const css = makeStyles(styles)();
  const {
    attachment_url: attachmentUrl,
    unique_id: uniqueID,
    _destroy: destroyed
  } = value;

  const fields = buildAttachmentFieldsObject(name, index);

  const handleRemove = () => {
    if (attachmentUrl) {
      arrayHelpers.replace(index, {
        _destroy: uniqueID,
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
                <img src={attachmentUrl} alt="" className={css.editImg} />
              ) : (
                <AttachmentInput
                  fields={fields}
                  attachment={attachment}
                  name={name}
                />
              )}
            </>
          )}
        </Box>
        {disabled && !mode.isShow && (
          <div>
            <IconButton onClick={handleRemove}>
              <DeleteIcon />
            </IconButton>
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
