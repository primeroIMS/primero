// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { push } from "connected-react-router";

import { ROUTES } from "../../../../config";
import { useI18n } from "../../../i18n";
import { useMemoizedSelector } from "../../../../libs";
import Form from "../../../form";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { newPasswordResetRequest } from "../../../pages/admin/users-form/action-creators";
import { getSavingNewPasswordReset } from "../../../pages/admin/users-form/selectors";

import { form, validationSchema } from "./form";
import { FORM_ID } from "./constants";

const Component = ({ modal, handleSubmit }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const saving = useMemoizedSelector(state => getSavingNewPasswordReset(state));

  const onSubmit = values => {
    dispatch(newPasswordResetRequest(values.email));

    if (handleSubmit) {
      handleSubmit(values);
    }
  };

  return (
    <>
      <p>{i18n.t("login.password_reset_modal_text")}</p>
      <Form formSections={form(i18n)} validations={validationSchema(i18n)} onSubmit={onSubmit} formID={FORM_ID} />
      {modal || (
        <>
          <ActionButton
            text={i18n.t("buttons.ok")}
            id="buttons.ok"
            noTranslate
            type={ACTION_BUTTON_TYPES.default}
            pending={saving}
            rest={{
              form: FORM_ID,
              type: "submit"
            }}
          />
          <ActionButton
            text={i18n.t("buttons.cancel")}
            id="buttons.cancel"
            noTranslate
            type={ACTION_BUTTON_TYPES.default}
            isCancel
            rest={{ onClick: () => dispatch(push(ROUTES.login)) }}
          />
        </>
      )}
    </>
  );
};

Component.displayName = "PasswordResetRequest";

Component.defaultProps = {
  modal: false
};

Component.propTypes = {
  handleSubmit: PropTypes.func,
  modal: PropTypes.bool
};

export default Component;
