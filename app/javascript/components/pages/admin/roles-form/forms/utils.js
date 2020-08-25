/* eslint-disable import/prefer-default-export */

const buildLabel = (element, i18n, resource, approvalsLabel, type) => {
  const approvalLabel = Object.keys(approvalsLabel).filter(approval => element.includes(approval));

  const label = approvalsLabel[approvalLabel];

  return i18n.t(`permissions.resource.${resource}.actions.${element}.${type}`, {
    approval_label: label
  });
};

const buildAdminLevelMap = (i18n, key, value) => {
  const locationTypes = [];

  value.forEach(locationType => {
    locationTypes.push(`${i18n.t(`location.base_types.${locationType}`)}`);
  });

  return `${key} - ${locationTypes.join("/")}`;
};

export const buildPermissionOptions = (elements = [], i18n, resource, approvalsLabel = {}) =>
  elements.map(element => ({
    id: element,
    display_text: buildLabel(element, i18n, resource, approvalsLabel, "label"),
    tooltip: buildLabel(element, i18n, resource, approvalsLabel, "explanation")
  }));

export const buildReportingLocationTooltip = (i18n, adminLevelMap) => {
  const currentLabels = [];

  adminLevelMap.mapEntries(([key, value]) => {
    currentLabels.push(buildAdminLevelMap(i18n, key, value));
  });

  return `${i18n.t("permissions.resource.reporting_location_level.explanation")} ${currentLabels.join(", ")}`;
};
