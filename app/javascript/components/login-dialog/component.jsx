import { useRef } from "react";

import ActionDialog, { useDialog } from "../action-dialog";
import Login from "../login";
import { FORM_ID } from "../login/components/login-form/constants";

import { LOGIN_DIALOG } from "./constants";

const Component = () => {
  const dialogRef = useRef({});
  const { dialogOpen, pending } = useDialog(LOGIN_DIALOG);

  return (
    <ActionDialog
      open={dialogOpen}
      dialogTitle={dialogRef.current.title}
      confirmButtonLabel={dialogRef.current.actionButton}
      hideIcon
      maxSize="xs"
      pending={pending}
      confirmButtonProps={{
        type: "submit",
        form: FORM_ID
      }}
      disableClose
      omitCloseAfterSuccess
      disableBackdropClick
    >
      <Login modal dialogRef={dialogRef} />
    </ActionDialog>
  );
};

Component.displayName = "LoginDialog";

export default Component;
