export default (columns, i18n) => {
  const hasObject = columns.some(column => typeof column === "object");

  if (hasObject) {
    const [columns1, columns2] = columns.map(column =>
      column.items.filter(elem => !["_total", i18n.t("report.total")].includes(elem))
    );

    return columns1
      .flatMap(column1 => columns2.map(column2 => `${column1}.${column2}`).concat(`${column1}`))
      .map(column => `${column}.${i18n.t("report.total")}`);
  }

  return columns
    .filter(column => !["_total", i18n.t("report.total")].includes(column))
    .map(column => `${column}.${i18n.t("report.total")}`);
};
