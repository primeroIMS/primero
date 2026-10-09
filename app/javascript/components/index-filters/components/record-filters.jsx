import { RECORD_PATH } from "../../../config";
import { useI18n } from "../../i18n";
import { MY_CASES_FILTER_NAME, OR_FILTER_NAME } from "../constants";
import { calculateFilters, filterType, isDateFieldFromValue, inArrayAndFilter } from "../utils";

const RecordFilters = ({
  defaultFilters,
  filters,
  more,
  moreSectionFilters,
  primaryFilters,
  queryParams,
  recordType,
  reset,
  setMoreSectionFilters,
  setReset
}) => {
  const i18n = useI18n();
  const multipleConditionsLabel = i18n.t("filters.multiple_conditions_applied");
  const moreSectionKeys = Object.keys(moreSectionFilters);
  const defaultFilterNames = defaultFilters.map(t => t.field_name);

  const currentFilters =
    recordType === RECORD_PATH.cases
      ? calculateFilters({
          defaultFilters,
          primaryFilters,
          defaultFilterNames,
          filters,
          locale: i18n.locale,
          more,
          moreSectionKeys,
          queryParams
        })
      : filters;

  return currentFilters.map(filter => {
    const Filter = filterType(filter.type);
    const secondary =
      moreSectionKeys.includes(filter.field_name) ||
      (filter.field_name === MY_CASES_FILTER_NAME && moreSectionKeys.includes(OR_FILTER_NAME)) ||
      isDateFieldFromValue(filter, moreSectionKeys, i18n.locale);

    const mode = {
      secondary,
      defaultFilter: defaultFilterNames.includes(filter.field_name)
    };

    const nested = inArrayAndFilter(filter, queryParams);

    if (!Filter) return null;

    return (
      <Filter
        key={`${filter.name}-filter`}
        filter={filter}
        moreSectionFilters={moreSectionFilters}
        setMoreSectionFilters={setMoreSectionFilters}
        reset={reset}
        setReset={setReset}
        mode={mode}
        disabled={nested}
        helpText={nested && multipleConditionsLabel}
      />
    );
  });
};

RecordFilters.displayName = "RecordFilters";

export default RecordFilters;
