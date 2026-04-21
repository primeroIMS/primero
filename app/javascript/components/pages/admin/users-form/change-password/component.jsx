import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";

import ActionDialog from "../../../../action-dialog";
import FormSection from "../../../../form/components/form-section";

import { NAME, FORM_ID } from "./constants";
import changePasswordForm from "./form";
import validations from "./validations";

function Component({ formMode, i18n, open, pending, close, parentFormMethods }) {
  const [closeConfirmationModal, setCloseConfirmationModal] = useState(false);

  const validationSchema = validations(i18n);

  const closeChangePassword = () => close();

  const formMethods = useForm({ ...(validationSchema && { resolver: yupResolver(validationSchema) }) });

  const {
    handleSubmit,
    formState: { isDirty }
  } = formMethods;

  const { setValue } = parentFormMethods;

  const onSubmit = data => {
    Object.entries(data).forEach(([key, value]) => {
      setValue(key, value, { shouldDirty: true });
    });

    closeChangePassword();
  };

  const cancelHandler = () => {
    if (isDirty) {
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

  return (
    <>
      <ActionDialog
        open={open}
        confirmButtonProps={{
          type: "submit",
          form: FORM_ID
        }}
        cancelHandler={cancelHandler}
        dialogTitle={i18n.t("buttons.change_password")}
        confirmButtonLabel={i18n.t("buttons.update")}
        pending={pending}
        omitCloseAfterSuccess
      >
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
          {changePasswordForm(i18n).map(formSection => (
            <FormSection
              formSection={formSection}
              key={formSection.unique_id}
              formMode={formMode}
              formMethods={formMethods}
            />
          ))}
        </form>
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
  parentFormMethods: PropTypes.object,
  pending: PropTypes.bool
};

export default Component;
