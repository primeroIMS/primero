export default (field, form, i18n) => {
  const { id, label, required } = field;
  const { errors } = form;

  return {
    label,
    required,
    error: errors?.[id],
    helperText: errors?.[id],
    margin: "dense",
    placeholder: i18n.t("transfer.select_label"),
    InputLabelProps: {
      htmlFor: id,
      shrink: true
    }
  };
};
