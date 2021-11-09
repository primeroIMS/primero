import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { useMemoizedSelector, useThemeHelper } from "../../../../libs";
import Form from "../../../form";
import { useI18n } from "../../../i18n";
import { enqueueSnackbar } from "../../../notifier";
import { PageHeading } from "../../../page";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useApp } from "../../../application";
import { useDialog } from "../../../action-dialog";
import { NAME as PASSWORD_RESET_DIALOG_NAME } from "../password-reset-dialog/constants";
import PasswordResetDialog from "../password-reset-dialog";
import { getUseIdentityProvider } from "../../selectors";
import utils from "../../utils";

import { NAME, FORM_ID } from "./constants";
import css from "./styles.css";
import { attemptLogin } from "./action-creators";
import { selectAuthErrors } from "./selectors";
import { form, validationSchema } from "./form";

const Container = ({ modal }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { demo } = useApp();
  const { mobileDisplay } = useThemeHelper();
  const { setDialog, dialogOpen, dialogClose } = useDialog(PASSWORD_RESET_DIALOG_NAME);

  const authErrors = useMemoizedSelector(state => selectAuthErrors(state));
  const useIdentityProvider = useMemoizedSelector(state => getUseIdentityProvider(state));

  const validations = validationSchema(i18n);
  const formSections = form(i18n);

  const handleSubmit = values => {
    dispatch(attemptLogin(values));
  };

  const onClickForgotLink = () => {
    setDialog({ dialog: PASSWORD_RESET_DIALOG_NAME, open: true });
  };

  useEffect(() => {
    dispatch(enqueueSnackbar(authErrors, { type: "error" }));
  }, [authErrors, dispatch]);

  const { title, actionButton } = utils.loginComponentText(i18n, demo);

  const renderForgotPassword = !useIdentityProvider && (
    <>
      <ActionButton
        className={css.forgotPaswordLink}
        onClick={onClickForgotLink}
        text="login.forgot_password"
        type={ACTION_BUTTON_TYPES.link}
      />
      {dialogOpen && <PasswordResetDialog open={dialogOpen} handleCancel={dialogClose} />}
    </>
  );

  return (
    <>
      <div className={css.loginContainer}>
        {modal || <PageHeading title={title} noPadding noElevation />}
        <Form formSections={formSections} validations={validations} onSubmit={handleSubmit} formID={FORM_ID} />
        {modal || (
          <ActionButton
            id={`${FORM_ID}-button`}
            text={actionButton}
            type={ACTION_BUTTON_TYPES.default}
            size="large"
            noTranslate
            rest={{
              fullWidth: mobileDisplay,
              form: FORM_ID,
              type: "submit"
            }}
          />
        )}
      </div>
      {renderForgotPassword}
    </>
  );
};

Container.displayName = NAME;

Container.defaultProps = {
  modal: false
};

Container.propTypes = {
  modal: PropTypes.bool
};

export default Container;
