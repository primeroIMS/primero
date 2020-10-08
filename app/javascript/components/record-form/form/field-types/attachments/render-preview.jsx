import React from "react";

import AttachmentPreview from "./attachment-preview";

// eslint-disable-next-line react/display-name
export default (attachment, file, css) => {
  const { data, fileName } = file;

  if (!data) return false;

  return <AttachmentPreview name={fileName} attachment={attachment} attachmentUrl={data} className={css.preview} />;
};
