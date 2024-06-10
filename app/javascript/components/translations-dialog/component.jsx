// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import CheckIcon from "@mui/icons-material/Check";
import PropTypes from "prop-types";
import first from "lodash/first";
import get from "lodash/get";

import ActionDialog, { useDialog } from "../action-dialog";
import Form from "../form";
import { useI18n } from "../i18n";
import { getObjectPath } from "../../libs";

import { FORM_ID, NAME } from "./constants";
import { translationsForm, validationSchema } from "./form";
import { localesToRender } from "./utils";
import css from "./styles.css";

const Component = ({ formMethods, mode, dialogTitle }) => {
  const i18n = useI18n();
  const validations = validationSchema(i18n);
  const currentValues = formMethods.getValues({ nest: true });
  const locales = localesToRender(i18n.applicationLocales);
  const firstLocale = first(locales)?.id;

  const initialValues = {
    locale_id: firstLocale,
    name: currentValues.name,
    description: currentValues.description
  };

  const formOptions = {
    shouldUnregister: false
  };

  const { dialogOpen, dialogClose } = useDialog(NAME);

  const handleClose = () => dialogClose();

  const handleSubmit = data => {
    getObjectPath("", data).forEach(path => {
      const value = get(data, path);

      formMethods.setValue(path, value, { shouldDirty: true });
    });

    handleClose();
  };

  const modalProps = {
    confirmButtonLabel: i18n.t("buttons.update"),
    confirmButtonProps: {
      icon: <CheckIcon />,
      form: FORM_ID,
      type: "submit"
    },
    dialogTitle,
    open: dialogOpen,
    cancelHandler: handleClose,
    omitCloseAfterSuccess: true
  };

  const formSections = translationsForm({
    i18n,
    locales,
    currentValues,
    selectedLocaleId: firstLocale
  });

  return (
    <ActionDialog {...modalProps}>
      <Form
        formClassName={css.translationsDialog}
        formSections={formSections}
        initialValues={initialValues}
        validations={validations}
        onSubmit={handleSubmit}
        formID={FORM_ID}
        mode={mode}
        formOptions={formOptions}
      />
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  dialogTitle: PropTypes.string.isRequired,
  formMethods: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired
};

export default Component;
