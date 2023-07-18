import { fromJS } from "immutable";

const subColumLookupValues = (subColumnLookups, valueKey) => {
  if (subColumnLookups && subColumnLookups[valueKey]) {
    return subColumnLookups[valueKey];
  }

  return [];
};

export default ({ hasTotalColumn, subColumnLookups, valueKey, ageRanges, indicatorsSubcolumns, totalText }) => {
  const lookupValues = subColumLookupValues(subColumnLookups, valueKey);

  if (lookupValues.length > 0) {
    if (hasTotalColumn) {
      return lookupValues.concat({ id: "total", display_text: totalText });
    }

    return lookupValues;
  }

  if (indicatorsSubcolumns.get(valueKey) === "AgeRange") {
    const ageRangeOptions = ageRanges.map(ageRange => ({ id: ageRange, display_text: ageRange }));

    if (hasTotalColumn) {
      return ageRangeOptions.concat({ id: "total", display_text: totalText });
    }

    return ageRangeOptions;
  }

  return indicatorsSubcolumns.get(valueKey, fromJS([])).toJS();
};
