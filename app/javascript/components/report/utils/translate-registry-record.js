import isEmpty from "lodash/isEmpty";

export default ({ registryRecordId, field, registryOptions, locale, incompleteDataLabel }) => {
  if (registryRecordId === "incomplete_data") {
    return incompleteDataLabel;
  }

  const collapsedFieldNames = registryOptions?.[field.registry_type]?.collapsed_field_names || [];

  return collapsedFieldNames
    .map(fieldName => {
      const displayText = field.registry_option_labels[fieldName].option_labels.find(
        option => option.id === registryRecordId
      )?.display_text;

      return displayText?.[locale.current || locale.default];
    })
    .filter(displayText => !isEmpty(displayText))
    .join(" - ");
};
