import React, { useRef } from "react";

import ActionDialog, { useDialog } from "../action-dialog";
import Login from "../login";

import { LOGIN_DIALOG } from "./constants";

const Component = () => {
  const formRef = useRef();
  const dialogRef = useRef({});
  const { dialogOpen, pending } = useDialog(LOGIN_DIALOG);

  const bindFormSubmit = () => {
    formRef.current.submitForm();
  };

  return (
    <ActionDialog
      open={dialogOpen}
      dialogTitle={dialogRef.current.title}
      confirmButtonLabel={dialogRef.current.actionButton}
      hideIcon
      maxSize="xs"
      pending={pending}
      successHandler={bindFormSubmit}
      disableClose
      omitCloseAfterSuccess
      disableBackdropClick
    >
      <Login modal formRef={formRef} dialogRef={dialogRef} />
    </ActionDialog>
  );
};

Component.displayName = "LoginDialog";

export default Component;
