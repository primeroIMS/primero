// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import { addFlag } from "../../action-creators";
import { toServerDateFormat } from "../../../../libs";
import Form from "../../../form";

import { NAME } from "./constants";
import { form, validationSchema } from "./form";

const initialValues = {
  date: toServerDateFormat(Date.now()),
  message: ""
};

function Component({ recordType, record, handleActiveTab }) {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const path = Array.isArray(record) ? `${recordType}/flags` : `${recordType}/${record}/flags`;

  const handleSubmit = async data => {
    const body = Array.isArray(record) ? { data: { data, record, record_type: recordType } } : { data };

    await dispatch(addFlag(body, i18n.t("flags.flag_added"), path));
    handleActiveTab(0);
  };

  return (
    <Form
      formID={NAME}
      formSections={form(i18n)}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validations={validationSchema}
      resetAfterSubmit
    />
  );
}

Component.displayName = NAME;

Component.propTypes = {
  handleActiveTab: PropTypes.func,
  record: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired
};

export default Component;
