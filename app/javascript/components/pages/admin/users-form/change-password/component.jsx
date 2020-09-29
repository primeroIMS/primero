import React, { useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FormContext, useForm, useFormContext } from "react-hook-form";

import ActionDialog from "../../../../action-dialog";
import FormSection from "../../../../form/components/form-section";
import bindFormSubmit from "../../../../../libs/submit-form";
import CancelPrompt from "../../../../form/components/cancel-prompt";

import { NAME } from "./constants";
import changePasswordForm from "./form";
import validations from "./validations";

function Component({ formMode, i18n, open, pending, setOpen }) {
  const formRef = useRef();
  const [deleteModal, setDeleteModal] = useState(false);
  const validationSchema = validations(i18n);
  const formMethods = useForm({ ...(validationSchema && { validationSchema }) });
  const { setValue } = useFormContext();

  const cancelHandler = () => {
    if (!formMethods.formState.dirty) {
      setOpen(false);
    }

    setDeleteModal(true);
  };

  const onSubmit = data => {
    Object.entries(data).forEach(([key, value]) => {
      setValue(key, value);
    });
    cancelHandler();
  };

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
        open={deleteModal}
        successHandler={() => {
          setDeleteModal(false);
        }}
        cancelHandler={() => setDeleteModal(false)}
        dialogTitle={i18n.t("fields.remove")}
        dialogText={i18n.t("fields.subform_remove_message")}
        confirmButtonLabel={i18n.t("buttons.ok")}
      />
    </>
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
