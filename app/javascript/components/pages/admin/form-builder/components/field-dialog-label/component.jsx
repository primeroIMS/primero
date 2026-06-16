import PropTypes from "prop-types";

import { useI18n } from "../../../../../i18n";

import css from "./styles.css";

function Component({ formId, isNested, selectedField, selectedSubform }) {
  const i18n = useI18n();

  const currentFormId = isNested ? selectedSubform.get("id") : parseInt(formId, 10);
  const fieldFormId = selectedField.get("form_section_id");

  return fieldFormId && fieldFormId !== currentFormId ? (
    <p className={css.anotherFormLabel}>{i18n.t("fields.copy_from_another_form")}</p>
  ) : null;
}

Component.displayName = "FieldDialogLabel";

Component.propTypes = {
  formId: PropTypes.string.isRequired,
  isNested: PropTypes.bool,
  selectedField: PropTypes.object,
  selectedSubform: PropTypes.object
};

export default Component;
