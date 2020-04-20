export const localizeData = (data, fields, i18n) => {
  const localizedFields = fields
    .map(field => ({
      [field]: {
        [i18n.locale]: data[field]
      }
    }))
    .reduce((acc, value) => ({ ...acc, ...value }), {});

  return { ...data, ...localizedFields };
};

export const translateFields = (data, fields, i18n) => {
  const localizedFields = fields
    .map(field => ({ [field]: data[field] ? data[field][i18n.locale] : "" }))
    .reduce((acc, value) => ({ ...acc, ...value }), {});

  return { ...data, ...localizedFields };
};
