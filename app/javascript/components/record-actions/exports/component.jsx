import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { List } from "immutable";
import { object, string } from "yup";
import { withRouter, useLocation } from "react-router-dom";
import qs from "qs";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import Form, {
  FieldRecord,
  FormSectionRecord,
  FORM_MODE_DIALOG
} from "../../form";
import submitForm from "../../../libs/submit-form";
import { RECORD_TYPES } from "../../../config";
import { getFiltersValuesByRecordType } from "../../index-filters/selectors";
import { getRecords } from "../../index-table";
import { EXPORT_DIALOG } from "../constants";
import { getMetadata } from "../../record-list/selectors";

import { NAME, ALL_EXPORT_TYPES } from "./constants";
import { allowedExports, formatFileName, exporterFilters } from "./utils";
import { saveExport } from "./action-creators";

const Component = ({
  openExportsDialog,
  close,
  recordType,
  userPermissions,
  match,
  record,
  currentPage,
  selectedRecords,
  pending,
  setPending
}) => {
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const { params } = match;
  const isShowPage = Object.keys(params).length > 0;

  const records = useSelector(state => getRecords(state, recordType)).get(
    "data"
  );
  const metadata = useSelector(state => getMetadata(state, recordType));
  const totalRecords = metadata?.get("total", 0);
  const appliedFilters = useSelector(state =>
    getFiltersValuesByRecordType(state, recordType)
  );
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));

  const selectedRecordsLength = Object.values(selectedRecords || {}).flat()
    ?.length;

  const allCurrentRowsSelected =
    selectedRecordsLength > 0 &&
    records.size > 0 &&
    selectedRecordsLength === records.size;

  const allRecordsSelected = selectedRecordsLength === totalRecords;
  const handleSubmit = values => {
    const { id, format, message } = ALL_EXPORT_TYPES.find(
      e => e.id === values.export_type
    );
    const fileName = formatFileName(values.custom_export_file_name, format);
    const shortIds = records
      .toJS()
      .filter((_r, i) => selectedRecords[currentPage]?.includes(i))
      .map(r => r.short_id);

    const filters = exporterFilters(
      isShowPage,
      allCurrentRowsSelected,
      shortIds,
      appliedFilters,
      queryParams,
      record,
      allRecordsSelected
    );

    const body = {
      export_format: id,
      record_type: RECORD_TYPES[recordType],
      file_name: fileName,
      password: values.password
    };

    const data = { ...body, ...filters };

    setPending(true);

    dispatch(
      saveExport(
        { data },
        i18n.t(message || "exports.queueing", {
          file_name: fileName ? `: ${fileName}.` : "."
        }),
        i18n.t("exports.go_to_exports"),
        EXPORT_DIALOG
      )
    );
  };

  const validationSchema = object().shape({
    export_type: string().required(i18n.t("encrypt.export_type")),
    password: string().required(i18n.t("encrypt.password_label"))
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
      cancelHandler={close}
      pending={pending}
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
  currentPage: PropTypes.number,
  match: PropTypes.object,
  openExportsDialog: PropTypes.bool,
  pending: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.object,
  setPending: PropTypes.func,
  userPermissions: PropTypes.object
};

export default withRouter(Component);
