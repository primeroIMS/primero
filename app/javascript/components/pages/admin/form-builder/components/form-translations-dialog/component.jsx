import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import PropTypes from "prop-types";

import ActionDialog, { useDialog } from "../../../../../action-dialog";
import Form from "../../../../../form";
import { useI18n } from "../../../../../i18n";
import styles from "../styles.css";
import { localesToRender } from "../utils";
import { useApp } from "../../../../../application";

import { FORM_ID, NAME } from "./constants";
import { translationsForm, validationSchema } from "./forms";

const useStyles = makeStyles(styles);

const Component = ({ getValues, mode, onClose, onSuccess }) => {
  const css = useStyles();
  const i18n = useI18n();
  const validations = validationSchema(i18n);
  const currentValues = getValues({ nest: true });
  const locales = localesToRender(i18n);
  const firstLocale = locales?.first()?.get("id");
  const { limitedProductionSite } = useApp();

  const initialValues = {
    locale_id: firstLocale,
    name: currentValues.name,
    description: currentValues.description
  };

  const formOptions = {
    shouldUnregister: false
  };

  const { dialogOpen, dialogClose } = useDialog(NAME);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    dialogClose();
  };

  const handleSubmit = data => {
    if (onSuccess) {
      onSuccess(data);
    }
    handleClose();
  };

  const modalProps = {
    confirmButtonLabel: i18n.t("buttons.update"),
    confirmButtonProps: {
      icon: <CheckIcon />,
      form: FORM_ID,
      type: "submit"
    },
    dialogTitle: i18n.t("forms.translations.edit"),
    open: dialogOpen,
    cancelHandler: handleClose,
    omitCloseAfterSuccess: true,
    showSuccessButton: !limitedProductionSite
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
        className={css.formBuilderDialog}
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
  getValues: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func
};

export default Component;
