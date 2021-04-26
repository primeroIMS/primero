import { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import styles from "../../styles.css";

import { ATTACHMENT_TYPES } from "./constants";

const useStyles = makeStyles(styles);

const AttachmentPreview = ({ name, attachment, attachmentUrl }) => {
  const css = useStyles();
  const isAudioAttachment = attachment === ATTACHMENT_TYPES.audio;

  useEffect(() => {
    if (name && isAudioAttachment) {
      // eslint-disable-next-line no-unused-expressions
      document.getElementById(name)?.load();
    }
  }, [name]);

  if (isAudioAttachment) {
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
