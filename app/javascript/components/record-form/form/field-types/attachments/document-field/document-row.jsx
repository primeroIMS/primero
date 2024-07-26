import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";

import { useI18n } from "../../../../../i18n";
import { useThemeHelper } from "../../../../../../libs";
import css from "../../../styles.css";

import DocumentDelete from "./document-delete";

function Component({ document, handleOpen, mode, handleDelete }) {
  const { isRTL } = useThemeHelper();
  const i18n = useI18n();

  const renderIcon = isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRightIcon />;

  return (
    <div className={css.attachment}>
      <div className={css.attachmentMeta}>
        <span>{document.date && i18n.l("date.formats.default", document.date)}</span>
        {document.description}
      </div>
      <div className={css.attachmentActions}>
        {mode.isEdit && <DocumentDelete onClick={handleDelete} />}
        <IconButton size="large" onClick={handleOpen}>
          {renderIcon}
        </IconButton>
      </div>
    </div>
  );
}

Component.displayName = "DocumentFieldRow";

Component.propTypes = {
  document: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  mode: PropTypes.object.isRequired
};

export default Component;
