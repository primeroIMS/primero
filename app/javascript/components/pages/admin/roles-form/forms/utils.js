/* eslint-disable import/prefer-default-export */

export const buildPermissionOptions = (elements, i18n) =>
  (elements || []).map(element => ({
    id: element,
    display_text: i18n.t(`permissions.permission.${element}`)
  }));
