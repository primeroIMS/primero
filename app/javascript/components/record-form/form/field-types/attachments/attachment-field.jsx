import { useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";

import styles from "../../styles.css";
import ActionButton from "../../../../action-button";
import DisableOffline from "../../../../disable-offline";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import ActionDialog from "../../../../action-dialog";
import { useI18n } from "../../../../i18n";

import { buildAttachmentFieldsObject, buildBase64URL } from "./utils";
import AttachmentInput from "./attachment-input";
import AttachmentPreview from "./attachment-preview";

const useStyles = makeStyles(styles);

const AttachmentField = ({ name, index, attachment, disabled, mode, arrayHelpers, value }) => {
  const css = useStyles();
  const i18n = useI18n();
  const [open, setOpen] = useState(false);

  const {
    attachment_url: attachmentUrl,
    id,
    _destroy: destroyed,
    file_name: fileName,
    attachment: attachmentData,
    content_type: contentType
  } = value;

  const fields = buildAttachmentFieldsObject(name, index);

  const onOpenModal = () => setOpen(true);

  const onCloseModal = () => setOpen(false);

  const handleRemove = () => {
    if (attachmentUrl) {
      arrayHelpers.replace(index, {
        _destroy: id,
        attachment_type: attachment
      });
    } else {
      arrayHelpers.remove(index);
    }
  };

  if (destroyed) return null;

  const deleteButton = (
    <>
      <ActionButton
        icon={<DeleteIcon />}
        type={ACTION_BUTTON_TYPES.icon}
        isCancel
        rest={{
          onClick: onOpenModal
        }}
      />
    </>
  );

  const dialogTitle = `${i18n.t("fields.remove")} ${name}`;

  return (
    <Box className={css.uploadBox}>
      <Box display="flex" my={2} alignItems="center">
        <Box flexGrow="1">
          {!mode.isShow && (
            <>
              {attachmentUrl || attachmentData ? (
                <div className={css.attachmentRow}>
                  <AttachmentPreview
                    name={fileName}
                    attachment={attachment}
                    attachmentUrl={attachmentUrl || buildBase64URL(contentType, attachmentData)}
                  />
                  <DisableOffline>{deleteButton}</DisableOffline>
                </div>
              ) : (
                <AttachmentInput fields={fields} attachment={attachment} name={name} deleteButton={deleteButton} />
              )}
            </>
          )}
        </Box>
        {disabled && !mode.isShow && { deleteButton }}
        <ActionDialog
          open={open}
          successHandler={handleRemove}
          cancelHandler={onCloseModal}
          dialogTitle={dialogTitle}
          dialogText={i18n.t("fields.remove_attachment_confirmation")}
          confirmButtonLabel={i18n.t("buttons.ok")}
        />
      </Box>
    </Box>
  );
};

AttachmentField.displayName = "AttachmentField";

AttachmentField.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  attachment: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  index: PropTypes.number.isRequired,
  mode: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.object
};

export default AttachmentField;
