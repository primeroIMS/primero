import getSubformValues from "./get-subform-values";
import isSubformField from "./is-subform-field";
import mergeTranslationKeys from "./merge-translation-keys";

export default (selectedField, selectedSubform, currentValues) => {
  if (!isSubformField(selectedField)) {
    return {};
  }

  const subform = selectedSubform.toSeq()?.size ? getSubformValues(selectedSubform) : {};
  // eslint-disable-next-line camelcase
  const updatedSubformSection = currentValues?.subform_section;

  if (updatedSubformSection) {
    return {
      ...subform,
      subform_section: mergeTranslationKeys(subform.subform_section, updatedSubformSection, true)
    };
  }

  return subform;
};
