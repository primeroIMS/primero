import React, { useRef } from "react";
import PropTypes from "prop-types";

import ActionDialog from "../../../../action-dialog";
import bindFormSubmit from "../../../../../libs/submit-form";
import Form from "../../../../form";

import { form } from "./form";
import { NAME } from "./constants";

const Component = ({ close, i18n, open, pending }) => {
  const formRef = useRef();
  // const formMethods = useForm();

  const onSubmit = data => {
    console.log("SUBMIT: ", data);
  };

  return (
    <ActionDialog
      open={open}
      successHandler={() => bindFormSubmit(formRef)}
      cancelHandler={() => close()}
      dialogTitle={i18n.t("location.import_title")}
      confirmButtonLabel={i18n.t("buttons.import")}
      pending={pending}
    >
      <Form useCancelPrompt mode="new" formSections={form(i18n)} onSubmit={onSubmit} ref={formRef} />
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  i18n: PropTypes.object,
  open: PropTypes.bool,
  pending: PropTypes.bool
};

export default Component;
