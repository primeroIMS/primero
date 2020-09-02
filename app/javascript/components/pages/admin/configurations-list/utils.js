/* eslint-disable import/prefer-default-export */

export const getColumns = i18n => [
  { name: "name", label: i18n.t("configurations.attributes.name") },
  { name: "version", label: i18n.t("configurations.attributes.version") },
  { name: "description", label: i18n.t("configurations.attributes.description") },
  { name: "date_created", label: i18n.t("configurations.attributes.date_created") },
  { name: "last_applied_on", label: i18n.t("configurations.attributes.last_applied_on") }
];
