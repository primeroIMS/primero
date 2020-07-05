/* eslint-disable import/prefer-default-export */

const buildLabel = (element, i18n, resource, approvalsLabel, type) => {
  const approvalLabel = Object.keys(approvalsLabel).filter(approval =>
    element.includes(approval)
  );

  const label = approvalsLabel[approvalLabel];

  return i18n.t(`permissions.resource.${resource}.actions.${element}.${type}`, {
    approval_label: label
  });
};

export const buildPermissionOptions = (
  elements = [],
  i18n,
  resource,
  approvalsLabel = {}
) =>
  elements.map(element => ({
    id: element,
    display_text: buildLabel(element, i18n, resource, approvalsLabel, "label"),
    tooltip: buildLabel(element, i18n, resource, approvalsLabel, "explanation")
  }));
