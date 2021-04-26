import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import Form from "../../../form";
import ActionDialog from "../../../action-dialog";
import { useI18n } from "../../../i18n";
import { newPasswordResetRequest } from "../../../pages/admin/users-form/action-creators";
import { getSavingNewPasswordReset } from "../../../pages/admin/users-form/selectors";
import { useMemoizedSelector } from "../../../../libs";

import { form, validationSchema } from "./form";
import { NAME, FORM_ID } from "./constants";

const Component = ({ open, handleCancel, handleSuccess }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const saving = useMemoizedSelector(state => getSavingNewPasswordReset(state));

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true,
    form: FORM_ID,
    type: "submit"
  };

  const handleSubmit = values => {
    dispatch(newPasswordResetRequest(values.email));

    if (handleSuccess) {
      handleSuccess();
    }
  };

  return (
    <ActionDialog
      open={open}
      cancelHandler={handleCancel}
      dialogTitle={i18n.t("login.password_reset_modal")}
      pending={saving}
      omitCloseAfterSuccess
      confirmButtonLabel={i18n.t("buttons.ok")}
      confirmButtonProps={successButtonProps}
      onClose={handleCancel}
    >
      <p>{i18n.t("login.password_reset_modal_text")}</p>
      <Form formSections={form(i18n)} validations={validationSchema(i18n)} onSubmit={handleSubmit} formID={FORM_ID} />
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  open: false
};

Component.propTypes = {
  handleCancel: PropTypes.func,
  handleSuccess: PropTypes.func,
  open: PropTypes.bool
};

export default Component;
