import uniq from "lodash/uniq";

export default (data, i18n, qtyColumns, qtyRows) => {
  const totalLabel = i18n.t("report.total");
  const columnsArray = isNested => {
    return uniq(
      Object.values(data)
        .map(currValue => Object.keys(isNested ? Object.values(currValue)[0] : currValue))
        .flat()
    ).filter(key => key !== totalLabel);
  };

  if (qtyRows >= 2 && qtyColumns > 0) {
    return columnsArray(true);
  }

  return columnsArray();
};
