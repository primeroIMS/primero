import { fromJS } from "immutable";

const subColumLookupValues = (subColumnLookups, valueKey) => {
  if (subColumnLookups && subColumnLookups[valueKey]) {
    return subColumnLookups[valueKey];
  }

  return [];
};

export default ({
  hasTotalColumn,
  subColumnLookups,
  valueKey,
  ageRanges,
  indicatorsSubcolumns,
  indicatorSubColumnKeys,
  totalText
}) => {
  let lookupValues = subColumLookupValues(subColumnLookups, valueKey);

  if (lookupValues.length > 0) {
    const missingSubColumns = indicatorSubColumnKeys.filter(
      subcolumnKey => !lookupValues.some(value => subcolumnKey === value.id)
    );

    if (missingSubColumns) {
      lookupValues = lookupValues.concat(missingSubColumns.map(id => ({ id, display_text: id })));
    }

    if (hasTotalColumn) {
      lookupValues = lookupValues.concat({ id: "total", display_text: totalText });
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
