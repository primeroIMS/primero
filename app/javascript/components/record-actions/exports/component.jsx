import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { List } from "immutable";
import * as yup from "yup";

import { useI18n } from "../../i18n";
import { ActionDialog } from "../../action-dialog";
import Form, {
  FieldRecord,
  FormSectionRecord,
  FORM_MODE_DIALOG
} from "../../form";
import submitForm from "../../../submit-form";
import { RECORD_TYPES } from "../../../config";

import { NAME, ALL_EXPORT_TYPES } from "./constants";
import { allowedExports, formatFileName } from "./helpers";
import { saveExport } from "./action-creators";

const Component = ({
  openExportsDialog,
  close,
  recordType,
  userPermissions
}) => {
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();

  const handleSubmit = values => {
    const { format } = ALL_EXPORT_TYPES.find(e => e.id === values.export_type);
    const fileName = formatFileName(values.custom_export_file_name, format);
    const data = {
      export_format: format,
      record_type: RECORD_TYPES[recordType],
      file_name: fileName,
      password: values.password
    };

    dispatch(
      saveExport(
        { data },
        i18n.t("exports.queueing", {
          file_name: fileName ? `: ${fileName}` : "."
        }),
        i18n.t("exports.go_to_exports")
      )
    );
    close();
  };

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true
  };

  const validationSchema = yup.object().shape({
    export_type: yup.string().required(i18n.t("encrypt.export_type")),
    password: yup.string().required(i18n.t("encrypt.password_label"))
  });

  const formSections = List([
    FormSectionRecord({
      unique_id: "exports",
      fields: List([
        FieldRecord({
          display_name: i18n.t("encrypt.export_type"),
          name: "export_type",
          type: "select_box",
          option_strings_text: {
            en: allowedExports(userPermissions)
          },
          multi_select: false,
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("encrypt.password_label"),
          name: "password",
          type: "text_field",
          required: true,
          autoFocus: true,
          help_text: {
            en: i18n.t("encrypt.password_extra_info")
          },
          password: true
        }),
        FieldRecord({
          display_name: i18n.t("encrypt.file_name"),
          name: "custom_export_file_name",
          type: "textarea"
        })
      ])
    })
  ]);

  return (
    <ActionDialog
      open={openExportsDialog}
      successHandler={() => submitForm(formRef)}
      dialogTitle={i18n.t("cases.export")}
      confirmButtonLabel={i18n.t("buttons.export")}
      onClose={close}
      omitCloseAfterSuccess
      confirmButtonProps={successButtonProps}
    >
      <Form
        mode={FORM_MODE_DIALOG}
        formSections={formSections}
        onSubmit={handleSubmit}
        ref={formRef}
        validations={validationSchema}
      />
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  openExportsDialog: false
};

Component.propTypes = {
  close: PropTypes.func,
  openExportsDialog: PropTypes.bool,
  recordType: PropTypes.string.isRequired,
  userPermissions: PropTypes.object
};

export default Component;
