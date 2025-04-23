// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";

import css from "../../styles.css";
import { AssetJwt } from "../../../../asset-jwt";

import { ATTACHMENT_TYPES } from "./constants";

function AttachmentPreview({ name, attachment, attachmentUrl }) {
  const isAudioAttachment = attachment === ATTACHMENT_TYPES.audio;

  useEffect(() => {
    if (name && isAudioAttachment) {
      // eslint-disable-next-line no-unused-expressions
      document.getElementById(name)?.load();
    }
  }, [name]);

  if (isAudioAttachment) {
    return <AssetJwt id={name} src={attachmentUrl} type="audio" />;
  }

  return <AssetJwt data-testid="attachment" src={attachmentUrl} alt="" className={css.editImg} />;
}

AttachmentPreview.displayName = "AttachmentPreview";

AttachmentPreview.propTypes = {
  attachment: PropTypes.string,
  attachmentUrl: PropTypes.string,
  name: PropTypes.string
};

export default AttachmentPreview;
