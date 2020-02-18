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
