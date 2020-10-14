import startCase from "lodash/startCase";

import { dataToJS } from "../../../../../libs";

const buildLabel = (element, i18n, resource, approvalsLabel, type) => {
  const approvalLabel = Object.keys(approvalsLabel).filter(approval => element.includes(approval));

  const label = approvalsLabel[approvalLabel[approvalLabel.length - 1]];

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

export const buildAdminLevelSelect = adminLevelMap => {
  const data = dataToJS(adminLevelMap);

  return Object.entries(data).reduce((acc, obj) => {
    const [id, text] = obj;

    return [...acc, { id: parseInt(id, 10), display_text: text.map(value => startCase(value)).join(", ") }];
  }, []);
};
