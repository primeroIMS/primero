import isEmpty from "lodash/isEmpty";

import getTranslatedKey from "./get-translated-key";
import translateKeys from "./translate-keys";
import translateRegistryRecord from "./translate-registry-record";

const translateData = (data, fields, i18n, { agencies, locations, registryOptions } = {}) => {
  const incompleteDataLabel = i18n.t("report.incomplete_data");
  const currentTranslations = {};
  const keys = Object.keys(data);
  const totalTranslation = i18n.t("report.total");
  const locale = { current: i18n.locale, default: i18n.defaultLocale };

  if (keys.length === 1 && keys.includes("_total")) {
    currentTranslations[totalTranslation] = data._total;
    delete currentTranslations._total;
  } else if (!isEmpty(keys)) {
    const field = fields.shift();

    const storedFields = [...fields];

    const translations = translateKeys(keys, field, locale);

    keys.forEach(key => {
      if (key === "_total") {
        const translatedKey = totalTranslation;

        currentTranslations[translatedKey] = data[key];
        delete currentTranslations[key];
      } else {
        let translatedKey = null;

        if (field.registry_type) {
          translatedKey = translateRegistryRecord({
            registryRecordId: key,
            field,
            registryOptions,
            locale,
            incompleteDataLabel
          });

          delete currentTranslations[key];
        } else {
          // NOTE: We are not translating dates here!
          const translation = translations.find(currTranslation => currTranslation.id === key);

          translatedKey = translation
            ? translation.display_text
            : getTranslatedKey(key, field, { agencies, i18n, locations });

          if (translation) {
            currentTranslations[translatedKey] = { ...data[key] };
            delete currentTranslations[key];
          }
        }

        const translatedData = translateData(data[key], [...storedFields], i18n, {
          agencies,
          locations,
          registryOptions
        });

        currentTranslations[translatedKey] = translatedData;
      }
    });
  }

  return currentTranslations;
};

export default (data, fields, i18n, { agencies, locations, registryOptions } = {}) =>
  translateData(data, fields, i18n, { agencies, locations, registryOptions });
