import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { List } from "immutable";
import * as yup from "yup";
import { withRouter } from "react-router-dom";

import { useI18n } from "../../i18n";
import { ActionDialog } from "../../action-dialog";
import Form, {
  FieldRecord,
  FormSectionRecord,
  FORM_MODE_DIALOG
} from "../../form";
import submitForm from "../../../submit-form";
import { RECORD_TYPES } from "../../../config";
import { getFiltersValuesByRecordType } from "../../index-filters/selectors";
import { getRecords } from "../../index-table";

import { NAME, ALL_EXPORT_TYPES } from "./constants";
import { allowedExports, formatFileName, exporterFilters } from "./helpers";
import { saveExport } from "./action-creators";

const Component = ({
  openExportsDialog,
  close,
  recordType,
  userPermissions,
  match,
  record,
  selectedRecords
}) => {
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const { params } = match;
  const isShowPage = Object.keys(params).length > 0;

  const records = useSelector(state => getRecords(state, recordType)).get(
    "data"
  );
  const appliedFilters = useSelector(state =>
    getFiltersValuesByRecordType(state, recordType)
  );
  const allRowsSelected =
    selectedRecords?.length > 0 &&
    records.size > 0 &&
    selectedRecords?.length === records.size;

  const handleSubmit = values => {
    const { format } = ALL_EXPORT_TYPES.find(e => e.id === values.export_type);
    const fileName = formatFileName(values.custom_export_file_name, format);

    const shortIds = records
      .toJS()
      .filter((_r, i) => selectedRecords?.includes(i))
      .map(r => r.short_id);

    const filters = exporterFilters(
      isShowPage,
      allRowsSelected,
      shortIds,
      appliedFilters,
      record
    );

    const body = {
      export_format: format,
      record_type: RECORD_TYPES[recordType],
      file_name: fileName,
      password: values.password
    };

    const data = { ...body, ...filters };

    console.log(filters);

    dispatch(
      saveExport({ data }, i18n.t("exports.queueing", { file_name: fileName }))
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
            [i18n.locale]: allowedExports(userPermissions, i18n, isShowPage)
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
            [i18n.locale]: i18n.t("encrypt.password_extra_info")
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
  match: PropTypes.object,
  openExportsDialog: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.array,
  userPermissions: PropTypes.object
};

export default withRouter(Component);
