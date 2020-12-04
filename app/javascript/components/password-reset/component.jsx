import React, { useRef } from "react";
import qs from "qs";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckIcon from "@material-ui/icons/Check";

import { PageHeading } from "../page";
import Form, { FormAction } from "../form";
import { useI18n } from "../i18n";
import { getSavingPassword, resetPassword } from "../user";

import { form, validationSchema } from "./form";
import { NAME } from "./constants";

const Component = () => {
  const i18n = useI18n();
  const internalFormRef = useRef();
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = qs.parse(location.search.replace("?", ""));
  // eslint-disable-next-line camelcase
  const { reset_password_token } = queryParams;
  const saving = useSelector(state => getSavingPassword(state));

  const handleSubmit = values => {
    dispatch(resetPassword({ user: { ...values.user, reset_password_token } }));
  };

  const submitForm = () => {
    internalFormRef.current.submitForm();
  };

  return (
    <div>
      <PageHeading title="Set Password" whiteHeading />
      <Form
        formSections={form(i18n, submitForm)}
        validations={validationSchema(i18n)}
        onSubmit={handleSubmit}
        ref={internalFormRef}
      />
      <FormAction
        actionHandler={submitForm}
        text={i18n.t("buttons.save")}
        startIcon={<CheckIcon />}
        savingRecord={saving}
      />
    </div>
  );
};

Component.displayName = NAME;

export default Component;
