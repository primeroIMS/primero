/* eslint-disable import/prefer-default-export */

export const emptyColum = (i18n, withoutTotal = false) => (withoutTotal ? [""] : ["", i18n.t("report.total")]);
