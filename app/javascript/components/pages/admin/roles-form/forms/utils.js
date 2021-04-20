import startCase from "lodash/startCase";

const buildLabel = (element, i18n, resource, approvalsLabel, type) => {
  const approvalLabel = (approvalsLabel.size > 0 ? [...approvalsLabel.keys()] : []).filter(approval =>
    element.includes(approval)
  );

  const label = approvalsLabel.size > 0 ? approvalsLabel.get(approvalLabel[approvalLabel.length - 1]) : "";

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
  return adminLevelMap.entrySeq().reduce((acc, [id, text = []]) => {
    return [...acc, { id: parseInt(id, 10), display_text: text.map(value => startCase(value)).join(", ") }];
  }, []);
};
