import sortByDate from "./sort-by-date";

export default (i18n, object) => {
  const allKeys = (obj, prefix = "") => {
    return sortByDate(Object.keys(obj).filter(key => key !== i18n.t("report.total")))
      .concat(i18n.t("report.total"))
      .reduce((acc, el) => {
        if (typeof obj[el] === "object") {
          return [...acc, ...allKeys(obj[el], `${prefix + el}.`)];
        }

        return [...acc, prefix + el];
      }, []);
  };

  return allKeys(object);
};
