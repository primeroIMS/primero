import { fromJS } from "immutable";

import showMyCasesFilter from "./show-my-cases-filter";
import isDateFieldFromValue from "./is-date-field-from-value";

export default ({
  defaultFilters,
  primaryFilters,
  defaultFilterNames,
  filters,
  locale,
  more,
  moreSectionKeys,
  queryParamsKeys
}) => {
  const selectedFromMoreSection = filters.filter(
    filter =>
      moreSectionKeys.includes(filter.field_name) ||
      showMyCasesFilter(filter, moreSectionKeys) ||
      isDateFieldFromValue(filter, moreSectionKeys, locale)
  );

  const queryParamsFilter = filters.filter(
    filter =>
      !more &&
      (queryParamsKeys.includes(filter.field_name) ||
        showMyCasesFilter(filter, queryParamsKeys) ||
        isDateFieldFromValue(filter, queryParamsKeys, locale)) &&
      !(
        defaultFilterNames.includes(filter.field_name) ||
        primaryFilters.map(t => t.field_name).includes(filter.field_name)
      )
  );

  return fromJS([
    ...primaryFilters,
    ...defaultFilters,
    ...queryParamsFilter,
    ...(!more ? selectedFromMoreSection : [])
  ]);
};
