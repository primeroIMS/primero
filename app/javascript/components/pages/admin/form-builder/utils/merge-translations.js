export default data => {
  const source = { ...data };

  delete source.selected_locale_id;

  return source;
};
