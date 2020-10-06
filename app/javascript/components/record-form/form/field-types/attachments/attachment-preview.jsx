import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import styles from "../../styles.css";

import { ATTACHMENT_TYPES } from "./constants";

const AttachmentPreview = ({ name, attachment, attachmentUrl }) => {
  const css = makeStyles(styles)();

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    document.getElementById(name)?.load();
  });

  if (attachment === ATTACHMENT_TYPES.audio) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio id={name} controls>
        <source src={attachmentUrl} />
      </audio>
    );
  }

  return <img src={attachmentUrl} alt="" className={css.editImg} />;
};

AttachmentPreview.displayName = "AttachmentPreview";

AttachmentPreview.propTypes = {
  attachment: PropTypes.string,
  attachmentUrl: PropTypes.string,
  name: PropTypes.string
};

export default AttachmentPreview;
