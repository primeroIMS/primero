/* eslint-disable import/prefer-default-export */

export const getColumns = i18n => [
  { name: "name", label: i18n.t("configurations.columns.name") },
  { name: "version", label: i18n.t("configurations.columns.version") },
  { name: "description", label: i18n.t("configurations.columns.description") },
  { name: "date_created", label: i18n.t("configurations.columns.date_created") },
  { name: "last_applied_on", label: i18n.t("configurations.columns.last_applied_on") }
];
