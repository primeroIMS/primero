import React from "react";

import AttachmentPreview from "./attachment-preview";

export default (attachment, file, css) => {
  const { data } = file;

  if (!data) return false;

  return (
    <AttachmentPreview
      attachment={attachment}
      attachmentUrl={data}
      className={css.preview}
    />
  );
};
