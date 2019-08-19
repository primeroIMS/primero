export const selectLocales = state => {
  return state.getIn(["ui", "I18n", "locales"], []);
};
