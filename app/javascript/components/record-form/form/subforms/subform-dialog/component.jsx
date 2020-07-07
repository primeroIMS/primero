import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";

import FormSectionField from "../../form-section-field";
import { SUBFORM_DIALOG } from "../constants";
import ServicesSubform from "../services-subform";
import SubformMenu from "../subform-menu";
import { serviceHasReferFields } from "../../utils";
import ActionDialog from "../../../../action-dialog";
import { compactValues, emptyValues } from "../../../utils";

const Component = ({
  arrayHelpers,
  currentValue,
  dialogIsNew,
  field,
  formik,
  i18n,
  index,
  isFormShow,
  mode,
  oldValue,
  open,
  setOpen,
  title
}) => {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const changed = !emptyValues(compactValues(currentValue, oldValue));

  const handleClose = () => {
    if (changed) {
      setOpenConfirmationModal(true);
    } else {
      setOpen({ open: false, index: null });
    }
  };

  const buttonDialogText = dialogIsNew ? "buttons.add" : "buttons.update";

  const dialogActions =
    field.subform_section_id.unique_id === "services_section" &&
    mode.isShow &&
    serviceHasReferFields(formik.values.services_section[index]) ? (
      <SubformMenu index={index} values={formik.values.services_section} />
    ) : null;

  const modalConfirmationProps = {
    open: openConfirmationModal,
    maxSize: "xs",
    confirmButtonLabel: i18n.t("buttons.ok"),
    dialogTitle: title,
    dialogText: i18n.t("messages.confirmation_message"),
    disableBackdropClick: true,
    cancelHandler: () => setOpenConfirmationModal(false),
    successHandler: () => {
      arrayHelpers.replace(index, oldValue);
      setOpen({ open: false, index: null });
      setOpenConfirmationModal(true);
    }
  };

  if (index !== null) {
    return (
      <>
        <ActionDialog
          open={open}
          successHandler={() => setOpen({ open: false, index: null })}
          cancelHandler={handleClose}
          dialogTitle={title}
          omitCloseAfterSuccess
          confirmButtonLabel={i18n.t(buttonDialogText)}
          onClose={handleClose}
          dialogActions={dialogActions}
          disableActions={isFormShow}
        >
          {field.subform_section_id.unique_id === "services_section" ? (
            <ServicesSubform
              field={field}
              index={index}
              mode={mode}
              formik={formik}
            />
          ) : (
            field.subform_section_id.fields.map(f => {
              const fieldProps = {
                name: `${field.name}[${index}].${f.name}`,
                field: f,
                mode,
                index,
                parentField: field
              };

              return (
                <Box my={3} key={f.name}>
                  <FormSectionField {...fieldProps} />
                </Box>
              );
            })
          )}
        </ActionDialog>
        <ActionDialog {...modalConfirmationProps} />
      </>
    );
  }

  return null;
};

Component.displayName = SUBFORM_DIALOG;

Component.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  currentValue: PropTypes.object,
  dialogIsNew: PropTypes.bool.isRequired,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isFormShow: PropTypes.bool,
  mode: PropTypes.object.isRequired,
  oldValue: PropTypes.object,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default Component;
