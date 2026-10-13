import { Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../action-button";
import Content from "../../../record-form/form/field-types/attachments/document-field/components/content";
import viewerCss from "../../../record-form/form/field-types/attachments/document-field/styles.css";
import { enqueueSnackbar } from "../../../notifier";

import { PDF_CONTENT_TYPE } from "./constants";

function Component({ open, onClose, onAccept, termsOfUseUrl, mobileDisplay }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!termsOfUseUrl && open) {
      dispatch(enqueueSnackbar("", { messageKey: "error_page.no_terms_of_use.title", type: "error" }));
      onClose();
    }
  }, [termsOfUseUrl, open]);

  if (!termsOfUseUrl) {
    return null;
  }

  const termsOfUseFileName = "TermsofUse.pdf";

  const handleDownload = () => {
    window.open(termsOfUseUrl, "_blank");
  };

  return (
    <Dialog open={open} onClose={onAccept} maxWidth="xl" fullWidth>
      <div className={viewerCss.container}>
        <div className={viewerCss.title}>
          <h6 className={viewerCss.titleText}>{termsOfUseFileName}</h6>
          <ActionButton
            id="terms-of-use-close"
            type={ACTION_BUTTON_TYPES.icon}
            icon={<CloseIcon />}
            isTransparent
            onClick={onAccept}
          />
        </div>
        <div className={viewerCss.viewerContainer}>
          <div className={viewerCss.viewer} data-testid="content-container">
            <Content
              attachmentUrl={termsOfUseUrl}
              contentType={PDF_CONTENT_TYPE}
              fileName={termsOfUseFileName}
              mobileDisplay={mobileDisplay}
              handleAttachmentDownload={handleDownload}
              previewParams="show_buttons=downloadButton"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

Component.displayName = "TermsOfUsePreview";

Component.propTypes = {
  mobileDisplay: PropTypes.bool.isRequired,
  onAccept: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  termsOfUseUrl: PropTypes.string
};

export default Component;
