import isEmpty from "lodash/isEmpty";

export default (name, currLocale) => (isEmpty(name[currLocale]) ? name[window.I18n.defaultLocale] : name[currLocale]);
