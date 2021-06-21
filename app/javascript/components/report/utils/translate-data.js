import isEmpty from "lodash/isEmpty";

import getTranslatedKey from "./get-translated-key";
import translateKeys from "./translate-keys";

const translateData = (data, fields, i18n, { agencies, locations } = {}) => {
  const currentTranslations = {};
  const keys = Object.keys(data);
  const { locale } = i18n;

  if (keys.length === 1 && keys.includes("_total")) {
    currentTranslations[i18n.t("report.total")] = data._total;
    delete currentTranslations._total;
  } else if (!isEmpty(keys)) {
    const field = fields.shift();

    const storedFields = [...fields];
    const translations = translateKeys(keys, field, locale);

    keys.forEach(key => {
      if (key === "_total") {
        const translatedKey = i18n.t("report.total");

        currentTranslations[translatedKey] = data[key];
        delete currentTranslations[key];
      } else {
        // NOTE: We are not translating dates here!
        const translation = translations.find(currTranslation => currTranslation.id === key);

        const translatedKey = translation
          ? translation.display_text
          : getTranslatedKey(key, field, { agencies, i18n, locations });

        if (translation) {
          currentTranslations[translatedKey] = { ...data[key] };
          delete currentTranslations[key];
        }
        const translatedData = translateData(data[key], [...storedFields], i18n, { agencies, locations });

        currentTranslations[translatedKey] = translatedData;
      }
    });
  }

  return currentTranslations;
};

export default (data, fields, i18n, { agencies, locations } = {}) =>
  translateData(data, fields, i18n, { agencies, locations });
