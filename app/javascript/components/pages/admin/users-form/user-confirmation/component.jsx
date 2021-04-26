import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Dompurify from "dompurify";

import { useI18n } from "../../../../i18n";
import { getRoleName } from "../../../../application/selectors";
import ActionDialog from "../../../../action-dialog";
import { saveUser } from "../action-creators";
import { useMemoizedSelector } from "../../../../../libs";

import { NAME } from "./constants";

const Component = ({
  close,
  dialogName,
  id,
  isIdp,
  pending,
  saveMethod,
  setPending,
  open,
  userData,
  userName,
  identityOptions
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const roleName = useMemoizedSelector(state => getRoleName(state, userData.role_unique_id));

  const sanitizer = Dompurify.sanitize;

  const handleOk = () => {
    setPending(true);

    dispatch(
      saveUser({
        id,
        saveMethod,
        dialogName,
        body: { data: userData },
        message: i18n.t("user.messages.created"),
        failureMessage: i18n.t("user.messages.failure")
      })
    );
  };

  const successButtonProps = {
    color: "primary",
    variant: "contained",
    autoFocus: true
  };

  const { display_text: identityDisplayText } = identityOptions
    ? identityOptions.find(currentIdentity => currentIdentity.id === userData.identity_provider_unique_id) || {}
    : "";

  const dialogContent = (
    <p
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: sanitizer(
          i18n.t(`user.messages.new_confirm_${isIdp ? "" : "non_identity_"}html`, {
            username: userName,
            identity: identityDisplayText,
            role: roleName,
            email: userData.email
          })
        )
      }}
    />
  );

  return (
    <ActionDialog
      open={open}
      successHandler={handleOk}
      cancelHandler={close}
      dialogTitle=""
      pending={pending}
      omitCloseAfterSuccess
      confirmButtonLabel={i18n.t("buttons.ok")}
      confirmButtonProps={successButtonProps}
      onClose={close}
    >
      {dialogContent}
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  open: false
};

Component.propTypes = {
  close: PropTypes.func,
  dialogName: PropTypes.string,
  id: PropTypes.string,
  identityOptions: PropTypes.array,
  isIdp: PropTypes.bool,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  saveMethod: PropTypes.string,
  setPending: PropTypes.func,
  userData: PropTypes.object,
  userName: PropTypes.string
};

export default Component;
