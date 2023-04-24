import isEmpty from "lodash/isEmpty";

const translateOptions = (value, options, translations) => {
  const defaultLocale = window.I18n.defaultLocale || "en";

  if (isEmpty(options)) {
    return translations[defaultLocale][value];
  }

  let currValue = translations[options?.locale || defaultLocale][value];

  Object.entries(options).forEach(option => {
    const [optionKey, optionValue] = option;

    currValue = currValue.replace(optionKey, optionValue);
  });

  return currValue?.replace(/[^\w\s\'.]/gi, "");
};

export default translateOptions;
