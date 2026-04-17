export default (optionLabels, value, locale = "en") => optionLabels[locale].find(option => option.id === value);
