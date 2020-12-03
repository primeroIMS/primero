import startCase from "lodash/startCase";

import { dataToJS } from "../../../../../libs";

const buildLabel = (element, i18n, resource, approvalsLabel, type) => {
  const approvalLabel = Object.keys(approvalsLabel).filter(approval => element.includes(approval));

  const label = approvalsLabel[approvalLabel[approvalLabel.length - 1]];

  return i18n.t(`permissions.resource.${resource}.actions.${element}.${type}`, {
    approval_label: label
  });
};

export const buildPermissionOptions = (elements = [], i18n, resource, approvalsLabel = {}) =>
  elements.map(element => ({
    id: element,
    display_text: buildLabel(element, i18n, resource, approvalsLabel, "label"),
    tooltip: buildLabel(element, i18n, resource, approvalsLabel, "explanation")
  }));

export const buildAdminLevelSelect = adminLevelMap => {
  const data = dataToJS(adminLevelMap);

  return Object.entries(data).reduce((acc, obj) => {
    const [id, text] = obj;

    return [...acc, { id: parseInt(id, 10), display_text: text.map(value => startCase(value)).join(", ") }];
  }, []);
};
