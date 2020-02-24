import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/styles";

import styles from "../../styles.css";

const AttachmentLabel = ({
  label,
  disabled,
  mode,
  arrayHelpers,
  handleAttachmentAddition
}) => {
  const css = makeStyles(styles)();

  return (
    <div className={css.attachmentHeading}>
      <h4>{label}</h4>
      {disabled && !mode.isShow && (
        <div>
          <IconButton
            variant="contained"
            onClick={() => handleAttachmentAddition(arrayHelpers)}
          >
            <AddIcon />
          </IconButton>
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
  label: PropTypes.string.isRequired,
  mode: PropTypes.object.isRequired
};

export default AttachmentLabel;
