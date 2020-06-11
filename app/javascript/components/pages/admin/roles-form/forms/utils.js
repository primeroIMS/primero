/* eslint-disable import/prefer-default-export */

const buildLabelPermission = (element, i18n, resource, approvalsLabel) => {
  const approvalLabel = Object.keys(approvalsLabel).filter(approval =>
    element.includes(approval)
  );

  const label = approvalsLabel[approvalLabel];

  return i18n.t(`permissions.resource.${resource}.actions.${element}.label`, {
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
    display_text: buildLabelPermission(element, i18n, resource, approvalsLabel),
    tooltip: `permissions.resource.${resource}.actions.${element}.explanation`,
    i18nTitle: true
  }));
