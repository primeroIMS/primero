import merge from "lodash/merge";

export default data => {
  const translations = { ...data.translations };
  const source = { ...data };

  delete source.translations;
  delete source.selected_locale_id;

  return merge(source, translations);
};
