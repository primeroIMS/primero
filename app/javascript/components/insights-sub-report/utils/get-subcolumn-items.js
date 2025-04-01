// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, List } from "immutable";

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
  totalText,
  includeAllSubColumns = true,
  incompleteDataLabel
}) => {
  let lookupValues = subColumLookupValues(subColumnLookups, valueKey);

  if (lookupValues.length > 0) {
    if (indicatorSubColumnKeys && !includeAllSubColumns) {
      lookupValues = lookupValues.filter(value => indicatorSubColumnKeys.includes(value.id));
    }

    const missingSubColumns = (indicatorSubColumnKeys || []).filter(
      subcolumnKey => !lookupValues.some(value => subcolumnKey === value.id)
    );

    if (missingSubColumns) {
      lookupValues = lookupValues.concat(
        missingSubColumns.map(id => {
          if (id === "incomplete_data") {
            return { id, display_text: incompleteDataLabel };
          }

          return { id, display_text: id };
        })
      );
    }

    if (hasTotalColumn) {
      lookupValues = lookupValues.concat({ id: "total", display_text: totalText });
    }

    return lookupValues;
  }

  if (indicatorsSubcolumns.get(valueKey) === "AgeRange") {
    let ageRangeOptions = ageRanges.map(ageRange => ({ id: ageRange, display_text: ageRange }));

    const hasIncompleteData = (indicatorSubColumnKeys || []).includes("incomplete_data");

    if (hasIncompleteData) {
      ageRangeOptions = ageRangeOptions.concat({ id: "incomplete_data", display_text: incompleteDataLabel });
    }

    if (hasTotalColumn) {
      ageRangeOptions = ageRangeOptions.concat({ id: "total", display_text: totalText });
    }

    return ageRangeOptions;
  }

  const subcolumns = indicatorsSubcolumns.get(valueKey, fromJS([]));

  if (List.isList(subcolumns)) {
    return subcolumns.toJS();
  }

  return [];
};
