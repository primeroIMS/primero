import React, { useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { FormContext, useForm } from "react-hook-form";

import ActionDialog from "../../../../action-dialog";
import FormSection from "../../../../form/components/form-section";
import bindFormSubmit from "../../../../../libs/submit-form";

import { NAME } from "./constants";
import changePasswordForm from "./form";
import validations from "./validations";

function Component({ formMode, i18n, open, parentFormRef, pending, setOpen }) {
  const formRef = useRef();
  const validationSchema = validations(i18n);
  const formMethods = useForm({ ...(validationSchema && { validationSchema }) });

  const cancelHandler = () => setOpen(false);

  const onSubmit = data => console.log(data, parentFormRef);

  useImperativeHandle(formRef, () => ({
    submitForm(e) {
      formMethods.handleSubmit(data => {
        onSubmit(data);
      })(e);
    }
  }));

  return (
    <ActionDialog
      open={open}
      successHandler={() => bindFormSubmit(formRef)}
      cancelHandler={cancelHandler}
      dialogTitle={i18n.t("buttons.change_password")}
      confirmButtonLabel={i18n.t("buttons.update")}
      pending={pending}
      omitCloseAfterSuccess
    >
      <FormContext {...formMethods} formMode={formMode}>
        <form>
          {changePasswordForm(i18n).map(formSection => (
            <FormSection formSection={formSection} key={formSection.unique_id} />
          ))}
        </form>
      </FormContext>
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  formMode: PropTypes.object,
  i18n: PropTypes.object,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  setOpen: PropTypes.func
};

export default Component;
