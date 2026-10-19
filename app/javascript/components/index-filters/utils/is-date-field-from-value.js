export default (field, params, locale) => {
  if (field.type !== "dates") {
    return false;
  }

  const datesOption = field?.options?.[locale];

  if (!datesOption) {
    return false;
  }

  return datesOption?.filter(dateOption => params[dateOption.id])?.length > 0;
};
