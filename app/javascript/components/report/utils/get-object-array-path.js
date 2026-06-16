import sortByDate from "./sort-by-date";

export default (totalLabel, object) => {
  const allKeys = (obj, parent = []) => {
    return sortByDate(Object.keys(obj).filter(key => key !== totalLabel))
      .concat(totalLabel)
      .reduce((acc, current) => {
        if (obj[current] && typeof obj[current] === "object") {
          return [...acc, ...allKeys(obj[current], parent.length > 0 ? [...parent, current] : [current])];
        }

        if (parent.length > 0) {
          return [...acc, parent.concat(current)];
        }

        if (parent.length <= 0) {
          return [...acc, [current]];
        }

        return [...acc, current];
      }, []);
  };

  return allKeys(object);
};
