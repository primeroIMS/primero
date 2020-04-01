export default (field, options, disableControl, i18n) => {
  const { value } = field;
  const selected = options.filter(option => option.value === value)[0];

  return !disableControl && value !== ""
    ? selected
    : { value: "", label: i18n.t("fields.select_single") };
};
