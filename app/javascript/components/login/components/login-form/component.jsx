import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";

import { useMemoizedSelector, useThemeHelper } from "../../../../libs";
import Form from "../../../form";
import { useI18n } from "../../../i18n";
import { enqueueSnackbar } from "../../../notifier";
import { PageHeading } from "../../../page";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useApp } from "../../../application";
import { DEMO } from "../../../application/constants";
import { useDialog } from "../../../action-dialog";
import { NAME as PASSWORD_RESET_DIALOG_NAME } from "../password-reset-dialog/constants";
import PasswordResetDialog from "../password-reset-dialog";
import { getUseIdentityProvider } from "../../selectors";

import { NAME, FORM_ID } from "./constants";
import styles from "./styles.css";
import { attemptLogin } from "./action-creators";
import { selectAuthErrors } from "./selectors";
import { form, validationSchema } from "./form";

const Container = ({ dialogRef, formRef, modal }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { demo } = useApp();
  const internalFormRef = useRef();
  const { css, mobileDisplay } = useThemeHelper({ css: styles });
  const { setDialog, dialogOpen, dialogClose } = useDialog(PASSWORD_RESET_DIALOG_NAME);

  const authErrors = useMemoizedSelector(state => selectAuthErrors(state));
  const useIdentityProvider = useMemoizedSelector(state => getUseIdentityProvider(state));

  const validations = validationSchema(i18n);
  const formSections = form(i18n);

  if (modal) {
    // eslint-disable-next-line no-param-reassign
    formRef.current = { ...internalFormRef.current };
  }

  const handleSubmit = values => {
    dispatch(attemptLogin(values));
  };

  const onClickForgotLink = () => {
    setDialog({ dialog: PASSWORD_RESET_DIALOG_NAME, open: true });
  };

  useEffect(() => {
    dispatch(enqueueSnackbar(authErrors, { type: "error" }));
  }, [authErrors, dispatch]);

  const title = i18n.t("login.label");
  const actionButton = i18n.t("buttons.login");
  const demoTitle = `${i18n.t(DEMO)} ${title}`;
  const demoActionButton = `${actionButton} ${i18n.t("logger.to")} ${i18n.t(DEMO)}`;

  if (dialogRef) {
    // eslint-disable-next-line no-param-reassign
    dialogRef.current = {
      title,
      actionButton,
      ...(demo && {
        title: demoTitle,
        actionButton: demoActionButton
      })
    };
  }

  const renderForgotPassword = !useIdentityProvider && (
    <>
      <Button className={css.forgotPaswordLink} onClick={onClickForgotLink}>
        {i18n.t("login.forgot_password")}
      </Button>
      {dialogOpen && <PasswordResetDialog open={dialogOpen} handleCancel={dialogClose} />}
    </>
  );

  return (
    <>
      <div className={css.loginContainer}>
        {modal || <PageHeading title={demo ? demoTitle : title} whiteHeading />}
        <Form formSections={formSections} validations={validations} onSubmit={handleSubmit} formID={FORM_ID} />
        {modal || (
          <ActionButton
            text={demo ? demoActionButton : actionButton}
            type={ACTION_BUTTON_TYPES.default}
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
  dialogRef: PropTypes.object,
  formRef: PropTypes.object,
  modal: PropTypes.bool
};

export default Container;
