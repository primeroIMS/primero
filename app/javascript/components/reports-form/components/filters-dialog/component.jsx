import React, { useRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { FormContext, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import ActionDialog from "../../../action-dialog";
import bindFormSubmit from "../../../../libs/submit-form";
import { useI18n } from "../../../i18n";
import FormSection from "../../../form/components/form-section";
import { submitHandler, whichFormMode } from "../../../form";

import { NAME } from "./constants";
import form from "./form";

const Component = ({
  fields,
  open,
  setOpen,
  selectedIndex,
  setSelectedIndex,
  setIndexes,
  methods,
  onSuccess
}) => {
  const i18n = useI18n();
  const formRef = useRef();
  const fieldName =
    selectedIndex === null
      ? i18n.t("filters.label_new")
      : i18n.t("filters.label");

  const onClose = () => {
    setOpen(false);
    setSelectedIndex(null);
  };

  const onSubmit = () => {
    console.log("SuccessHandler");
  };

  const formMethods = useForm();
  const formMode = whichFormMode("edit");
  const dispatch = useDispatch();

  const modalProps = {
    confirmButtonLabel: i18n.t("buttons.save"),
    confirmButtonProps: {
      color: "primary",
      variant: "contained",
      autoFocus: true
    },
    dialogTitle: fieldName,
    cancelHandler: onClose,
    open,
    successHandler: bindFormSubmit(formRef)
  };

  useImperativeHandle(
    formRef,
    submitHandler({
      dispatch,
      formMethods,
      formMode,
      i18n,
      initialValues: {},
      onSubmit
    })
  );

  const reportFiltersForm = form(i18n, `filters[${selectedIndex}]`, fields);

  return (
    <>
      <ActionDialog {...modalProps}>
        <FormContext {...formMethods} formMode={formMode}>
          <form>
            {reportFiltersForm.map(formSection => (
              <FormSection
                formSection={formSection}
                key={formSection.unique_id}
              />
            ))}
          </form>
        </FormContext>
      </ActionDialog>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  fields: PropTypes.array,
  methods: PropTypes.object,
  open: PropTypes.bool.isRequired,
  selectedIndex: PropTypes.number,
  setIndexes: PropTypes.func,
  setOpen: PropTypes.func.isRequired,
  setSelectedIndex: PropTypes.func
};

export default Component;
