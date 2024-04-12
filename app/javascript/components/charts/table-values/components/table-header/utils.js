// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

export const emptyColumn = (i18n, withoutTotal = false) => (withoutTotal ? [""] : ["", i18n.t("report.total")]);
