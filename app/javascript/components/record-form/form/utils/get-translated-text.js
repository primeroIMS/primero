export default (displayText, i18n) => {
  return displayText instanceof Object ? displayText?.[i18n.locale] || "" : displayText;
};
