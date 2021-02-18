import AttachmentPreview from "./attachment-preview";
import { ATTACHMENT_TYPES } from "./constants";

// eslint-disable-next-line react/display-name
export default (attachment, file, css, deleteButton) => {
  const { data, fileName } = file;

  if (attachment === ATTACHMENT_TYPES.document && fileName) {
    return <span>{fileName}</span>;
  }

  if (!data) {
    return false;
  }

  return (
    <div className={css.attachmentRow}>
      <AttachmentPreview name={fileName} attachment={attachment} attachmentUrl={data} className={css.preview} />
      {deleteButton}
    </div>
  );
};
