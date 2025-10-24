// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { object, string } from "yup";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import Form, { FieldRecord, FORM_MODE_DIALOG, FormSectionRecord, OPTION_TYPES, SELECT_FIELD } from "../../form";
import { saveRecord } from "../../records";
import { ACTIONS } from "../../permissions";

import { fetchUsersIdentified } from "./action-creators";

const FORM_ID = "form_attribute";

function ActionAttribute({ close, open, record, recordType, pending, setPending }) {
  const dispatch = useDispatch();
  const i18n = useI18n();
  const debouncedFetch = debounce(value => {
    if (value && value.length >= 2) {
      dispatch(fetchUsersIdentified({ data: { query: value } }));
    }
  }, 500);

  const formSections = fromJS([
    FormSectionRecord({
      unique_id: "form_attribute",
      fields: [
        FieldRecord({
          name: "identified_by",
          required: true,
          display_name: { [i18n.locale]: i18n.t("user.label") },
          type: SELECT_FIELD,
          asyncOptions: true,
          asyncAction: null,
          asyncOptionsLoadingPath: ["forms", "options", "users", "loading"],
          asyncParamsFromWatched: [],
          onInputChange: (_, value, reason) => {
            if (reason === "input") {
              debouncedFetch(value);
            }
          },
          option_strings_source: OPTION_TYPES.USER_IDENTIFIED
        })
      ]
    })
  ]);

  const validationSchema = object().shape({ identified_by: string().nullable().required() });

  const handleSubmit = data => {
    setPending(true);
    dispatch(
      saveRecord(
        recordType,
        "update",
        { data: { ...data }, record_action: ACTIONS.ATTRIBUTE },
        record.get("id"),
        i18n.t(`cases.attribute.success`),
        i18n.t("offline_submitted_changes"),
        false,
        false
      )
    );
    close();
  };

  return (
    <ActionDialog
      open={open}
      onClose={close}
      pending={pending}
      omitCloseAfterSuccess
      dialogSubHeader={i18n.t("cases.attribute.text")}
      dialogTitle={i18n.t("cases.attribute.title")}
      confirmButtonLabel={i18n.t("buttons.save")}
      confirmButtonProps={{
        form: FORM_ID,
        type: "submit"
      }}
    >
      <Form
        mode={FORM_MODE_DIALOG}
        formSections={formSections}
        onSubmit={handleSubmit}
        validations={validationSchema}
        formID={FORM_ID}
        showTitle={false}
      />
    </ActionDialog>
  );
}

ActionAttribute.displayName = "ActionAttribute";

ActionAttribute.propTypes = {
  close: PropTypes.func,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string,
  setPending: PropTypes.func
};

export default ActionAttribute;
