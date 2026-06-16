export default (field, keys, locale) => {
  if (field.type !== "dates") {
    return false;
  }

  const datesOption = field?.options?.[locale];

  if (!datesOption) {
    return false;
  }

  return datesOption?.filter(dateOption => keys.includes(dateOption.id))?.length > 0;
};
