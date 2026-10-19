import PropTypes from "prop-types";

import { RECORD_PATH } from "../../../config";
import { filterType, inArrayAndFilter } from "../utils";
import { MY_CASES_FILTER_NAME, OR_FILTER_NAME } from "../constants";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";
import { useI18n } from "../../i18n";

import css from "./styles.css";
import { NAME } from "./constants";

function MoreSection({
  allAvailable,
  defaultFilters,
  more,
  moreSectionFilters,
  primaryFilters,
  queryParams,
  recordType,
  setMore,
  setMoreSectionFilters
}) {
  const i18n = useI18n();
  const multipleConditionsLabel = i18n.t("filters.multiple_conditions_applied");
  const moreSectionKeys = Object.keys(moreSectionFilters);
  const mode = {
    secondary: true,
    defaultFilter: false
  };

  if (recordType !== RECORD_PATH.cases) {
    return null;
  }

  const renderSecondaryFilters = () => {
    const secondaryFilters = allAvailable.filter(
      field =>
        ![
          ...primaryFilters.map(p => p.field_name),
          ...defaultFilters.map(d => d.field_name),
          ...(!more ? moreSectionKeys : []),
          ...(!more && moreSectionKeys.includes(OR_FILTER_NAME) ? [MY_CASES_FILTER_NAME] : [])
        ].includes(field.field_name)
    );

    return secondaryFilters.map(filter => {
      const Filter = filterType(filter.type);

      if (!Filter) return null;

      const nested = inArrayAndFilter(filter, queryParams);

      return (
        <Filter
          filter={filter}
          key={[`${filter.name}-secondary-filter`, filter.module_id].join("-")}
          mode={mode}
          moreSectionFilters={moreSectionFilters}
          setMoreSectionFilters={setMoreSectionFilters}
          disabled={nested}
          helpText={nested && multipleConditionsLabel}
        />
      );
    });
  };

  const renderText = more ? "filters.less" : "filters.more";

  const filters = more ? renderSecondaryFilters() : null;

  const handleMore = () => setMore(!more);

  return (
    <>
      {filters}
      <ActionButton
        text={renderText}
        type={ACTION_BUTTON_TYPES.default}
        fullWidth
        variant="outlined"
        onClick={handleMore}
        className={css.moreBtn}
      />
    </>
  );
}

MoreSection.displayName = NAME;

MoreSection.propTypes = {
  allAvailable: PropTypes.object,
  defaultFilters: PropTypes.object,
  more: PropTypes.bool,
  moreSectionFilters: PropTypes.object,
  primaryFilters: PropTypes.object,
  queryParams: PropTypes.object,
  recordType: PropTypes.string,
  setMore: PropTypes.func,
  setMoreSectionFilters: PropTypes.func
};

export default MoreSection;
