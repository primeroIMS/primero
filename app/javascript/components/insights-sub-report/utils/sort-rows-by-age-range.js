import first from "lodash/first";

export default (rows, ageRanges) =>
  ageRanges.reduce((acc, range) => {
    const row = rows.find(r => first(r.row) === range);

    if (row) {
      return acc.concat(row);
    }

    return acc;
  }, []);
