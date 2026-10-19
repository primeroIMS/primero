import { fromJS } from "immutable";

import showMyCasesFilter from "./show-my-cases-filter";
import isDateFieldFromValue from "./is-date-field-from-value";
import inArrayAndFilter from "./in-array-and-filter";

export default ({
  defaultFilters,
  primaryFilters,
  defaultFilterNames,
  filters,
  locale,
  more,
  moreSectionKeys,
  queryParams
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
      (queryParams[filter.field_name] ||
        showMyCasesFilter(filter, queryParams) ||
        isDateFieldFromValue(filter, queryParams, locale) ||
        inArrayAndFilter(filter, queryParams)) &&
      !(
        defaultFilterNames.includes(filter.field_name) ||
        primaryFilters.map(t => t.field_name).includes(filter.field_name)
      )
  );

  const selectedPrimaryFilters = primaryFilters.filter(filter => !defaultFilterNames.includes(filter.field_name));

  return fromJS([
    ...selectedPrimaryFilters,
    ...defaultFilters,
    ...(!more ? selectedFromMoreSection : []),
    ...queryParamsFilter
  ]);
};
