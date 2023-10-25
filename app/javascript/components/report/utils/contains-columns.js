// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (columns, data, i18n) => {
  const totalLabel = i18n.t("report.total");
  const keys = Object.keys(data).filter(key => key !== totalLabel);

  return columns.some(column => keys.includes(column));
};
