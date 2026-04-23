import uniq from "lodash/uniq";

const getUniqueKeys = values => {
  const keys = values.reduce((acc, elem) => {
    return acc.concat(
      elem.keySeq().reduce((kacc, kelem) => {
        if (["id", "total"].includes(kelem)) {
          return kacc;
        }

        return kacc.concat(kelem);
      }, [])
    );
  }, []);

  return uniq(keys);
};

export default indicatorValues => {
  if (indicatorValues.some(value => value.get("group_id"))) {
    return getUniqueKeys(indicatorValues.flatMap(value => value.get("data")));
  }

  return getUniqueKeys(indicatorValues);
};
