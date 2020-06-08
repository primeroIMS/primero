/* eslint-disable import/prefer-default-export */

const buildLabelPermission = (element, i18n, approvalsLabel) => {
  const approvalLabel = Object.keys(approvalsLabel).filter(approval =>
    element.includes(approval)
  );

  const label = approvalsLabel[approvalLabel];

  return i18n.t(`permissions.permission.${element}`, {
    approval_label: label
  });
};

export const buildPermissionOptions = (
  elements,
  i18n,
  approvalsLabel = {},
  recordType
) =>
  (elements || []).map(element => ({
    id: element,
    display_text: buildLabelPermission(element, i18n, approvalsLabel),
    tooltip: `permissions.resource.${recordType}.actions.${element}.explanation`
  }));
