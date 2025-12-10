import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../../action-button";
import { IMAGE_CONTENT_TYPES, PDF_CONTENT_TYPE } from "../constants";
import { useMemoizedSelector } from "../../../../../../../libs";
import { getUseIdentityProvider } from "../../../../../../login/selectors";
import { getIDPToken } from "../../../../../../login/components/idp-selection/auth-provider";

import ImageViewer from "./image-viewer";
import css from "./styles.css";

function Content({ attachmentUrl, contentType, fileName, mobileDisplay, handleAttachmentDownload }) {
  const [attachmentSrc, setAttachmentSrc] = useState(attachmentUrl);
  const [attachmentLoaded, setAttachmentLoaded] = useState(false);
  const isIDP = useMemoizedSelector(state => getUseIdentityProvider(state));

  async function fetchAttachment() {
    const token = await getIDPToken();

    const response = await fetch(attachmentUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const blob = await response.blob();

    await setAttachmentSrc(window.URL.createObjectURL(new Blob([blob])));
    await setAttachmentLoaded(true);
  }

  useEffect(() => {
    if (isIDP && contentType === PDF_CONTENT_TYPE) {
      fetchAttachment();
    } else {
      setAttachmentLoaded(true);
    }
  }, [isIDP, attachmentUrl, contentType]);

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

  if (contentType === PDF_CONTENT_TYPE && attachmentLoaded) {
    return (
      <object type="application/pdf" data={`/pdf-viewer?file=${attachmentSrc}`} width="100%" height="100%">
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
  mobileDisplay: PropTypes.bool.isRequired
};

export default Content;
