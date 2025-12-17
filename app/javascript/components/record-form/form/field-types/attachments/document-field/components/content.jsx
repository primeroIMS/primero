import PropTypes from "prop-types";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../../action-button";
import { IMAGE_CONTENT_TYPES, PDF_CONTENT_TYPE } from "../constants";

import ImageViewer from "./image-viewer";
import css from "./styles.css";

function Content({
  attachmentUrl,
  pdfAttachmentUrl,
  contentType,
  fileName,
  mobileDisplay,
  handleAttachmentDownload,
  previewParams = ""
}) {
  const fallbackComponent = (
    <div className={css.downloadBtnContainer}>
      <ActionButton
        text="buttons.download"
        type={ACTION_BUTTON_TYPES.default}
        isTransparent
        rest={{
          variant: "outlined",
          component: "a",
          onClick: handleAttachmentDownload
        }}
      />
    </div>
  );

  if (contentType === PDF_CONTENT_TYPE || pdfAttachmentUrl) {
    return (
      <object
        type="application/pdf"
        data={`/pdf-viewer?file=${pdfAttachmentUrl || attachmentUrl}&${previewParams}`}
        width="100%"
        height="100%"
      >
        {fallbackComponent}
      </object>
    );
  }

  if (IMAGE_CONTENT_TYPES.includes(contentType)) {
    return <ImageViewer alt={fileName} src={attachmentUrl} mobileDisplay={mobileDisplay} />;
  }

  return fallbackComponent;
}

Content.displayName = "DocumentFieldContent";

Content.propTypes = {
  attachmentUrl: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  handleAttachmentDownload: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  pdfAttachmentUrl: PropTypes.string.isRequired,
  previewParams: PropTypes.string
};

export default Content;
