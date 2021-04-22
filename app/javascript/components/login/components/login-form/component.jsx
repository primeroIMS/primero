import { useEffect } from "react";
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
import { useDialog } from "../../../action-dialog";
import { NAME as PASSWORD_RESET_DIALOG_NAME } from "../password-reset-dialog/constants";
import PasswordResetDialog from "../password-reset-dialog";
import { getUseIdentityProvider } from "../../selectors";
import utils from "../../utils";

import { NAME, FORM_ID } from "./constants";
import styles from "./styles.css";
import { attemptLogin } from "./action-creators";
import { selectAuthErrors } from "./selectors";
import { form, validationSchema } from "./form";

const Container = ({ modal }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { demo } = useApp();
  const { css, mobileDisplay } = useThemeHelper({ css: styles });
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
      <Button className={css.forgotPaswordLink} onClick={onClickForgotLink}>
        {i18n.t("login.forgot_password")}
      </Button>
      {dialogOpen && <PasswordResetDialog open={dialogOpen} handleCancel={dialogClose} />}
    </>
  );

  return (
    <>
      <div className={css.loginContainer}>
        {modal || <PageHeading title={title} whiteHeading />}
        <Form formSections={formSections} validations={validations} onSubmit={handleSubmit} formID={FORM_ID} />
        {modal || (
          <ActionButton
            text={actionButton}
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
  modal: PropTypes.bool
};

export default Container;
