import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

import styles from "../../styles.css";

import { ATTACHMENT_TYPES } from "./constants";

const AttachmentPreview = ({ attachment, attachmentUrl }) => {
  const css = makeStyles(styles)();

  if (attachment === ATTACHMENT_TYPES.audio) {
    return (
      <audio controls>
        <source src={attachmentUrl} />
      </audio>
    );
  }

  return <img src={attachmentUrl} alt="" className={css.editImg} />;
};

AttachmentPreview.displayName = "AttachmentPreview";

AttachmentPreview.propTypes = {
  attachment: PropTypes.string,
  attachmentUrl: PropTypes.string
};

export default AttachmentPreview;
