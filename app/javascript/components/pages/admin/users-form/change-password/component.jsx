import React, { useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FormContext, useForm, useFormContext } from "react-hook-form";

import ActionDialog from "../../../../action-dialog";
import FormSection from "../../../../form/components/form-section";
import bindFormSubmit from "../../../../../libs/submit-form";

import { NAME } from "./constants";
import changePasswordForm from "./form";
import validations from "./validations";

function Component({ formMode, i18n, open, pending, close }) {
  const formRef = useRef();
  const [closeConfirmationModal, setCloseConfirmationModal] = useState(false);
  const validationSchema = validations(i18n);
  const formMethods = useForm({ ...(validationSchema && { validationSchema }) });
  const { setValue } = useFormContext();

  const closeChangePassword = () => close();

  const onSubmit = data => {
    Object.entries(data).forEach(([key, value]) => {
      setValue(key.replace("_change", ""), value, false);
    });

    closeChangePassword();
  };

  const cancelHandler = () => {
    if (formMethods.formState.dirty) {
      setCloseConfirmationModal(true);
    } else {
      closeChangePassword();
    }
  };

  const succesConfirmationModal = () => {
    setCloseConfirmationModal(false);
    closeChangePassword();
  };

  const cancelConfirmationModal = () => setCloseConfirmationModal(false);

  useImperativeHandle(formRef, () => ({
    submitForm(e) {
      formMethods.handleSubmit(data => {
        onSubmit(data);
      })(e);
    }
  }));

  return (
    <>
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
      <ActionDialog
        open={closeConfirmationModal}
        successHandler={succesConfirmationModal}
        cancelHandler={cancelConfirmationModal}
        dialogTitle={i18n.t("buttons.change_password")}
        dialogText={i18n.t("messages.confirmation_message")}
        confirmButtonLabel={i18n.t("buttons.ok")}
      />
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  formMode: PropTypes.object,
  i18n: PropTypes.object,
  open: PropTypes.bool,
  pending: PropTypes.bool
};

export default Component;
