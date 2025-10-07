// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import { addFlag, updateFlag } from "../../action-creators";
import { reduceMapToObject, toServerDateFormat } from "../../../../libs";
import Form from "../../../form";
import { FLAG_DIALOG } from "../../constants";
import { useDialog } from "../../../action-dialog";

import { NAME } from "./constants";
import { form, validationSchema } from "./form";

const defaultValues = {
  date: toServerDateFormat(Date.now()),
  message: ""
};

function Component({ flag, formId = NAME, recordType, record, handleActiveTab }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { setDialog } = useDialog(FLAG_DIALOG);

  const path = Array.isArray(record) ? `${recordType}/flags` : `${recordType}/${record}/flags`;

  const handleSubmit = async data => {
    const body = Array.isArray(record) ? { data: { data, record, record_type: recordType } } : { data };

    if (flag?.get("id")) {
      dispatch(updateFlag({ recordId: record, recordType, flagId: flag.get("id"), body }));
      setDialog({ dialog: FLAG_DIALOG, open: true, pending: false });
    } else {
      dispatch(addFlag(body, i18n.t("flags.flag_added"), path));
      handleActiveTab(0);
    }
  };

  const initialValues = flag?.get("id") ? reduceMapToObject(flag) : defaultValues;
  const schema = validationSchema({
    labels: {
      message: i18n.t("forms.required_field", {
        field: i18n.t("flags.flag_reason")
      })
    }
  });

  return (
    <Form
      formID={formId}
      formSections={form(i18n)}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validations={schema}
    />
  );
}

Component.displayName = NAME;

Component.propTypes = {
  flag: PropTypes.object,
  formId: PropTypes.string,
  handleActiveTab: PropTypes.func,
  record: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired
};

export default Component;
