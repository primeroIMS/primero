// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import PropTypes from "prop-types";

import { useMemoizedSelector } from "../../../libs";
import { MODULES, RECORD_TYPES_PLURAL } from "../../../config";
import { hasPrimeroModule } from "../../user";
import { getFiltersByRecordType } from "../selectors";
import { DEFAULT_FILTERS, PRIMARY_FILTERS } from "../constants";

import MoreSection from "./more-section";
import Actions from "./actions";
import RecordFilters from "./record-filters";
import css from "./styles.css";
import FilterCategory from "./filter-category";

function TabFilters({
  formMethods,
  handleClear,
  handleSave,
  more,
  moreSectionFilters,
  queryParams,
  recordType,
  reset,
  setMore,
  setMoreSectionFilters,
  setReset
}) {
  const filterCategory = useWatch({ control: formMethods.control, name: "filter_category" });
  const filters = useMemoizedSelector(state => getFiltersByRecordType(state, recordType, filterCategory));
  const hasPrimeroModuleMRM = useMemoizedSelector(state => hasPrimeroModule(state, MODULES.MRM));
  const allPrimaryFilters = useMemo(
    () => filters.filter(filter => PRIMARY_FILTERS.includes(filter.unique_id)),
    [filters]
  );
  const allDefaultFilters = useMemo(
    () => filters.filter(filter => [...Object.keys(DEFAULT_FILTERS)].includes(filter.unique_id)),
    [filters]
  );

  return (
    <div className={css.tabContent}>
      <Actions handleSave={handleSave} handleClear={() => handleClear()} />
      {hasPrimeroModuleMRM && RECORD_TYPES_PLURAL.incident === recordType && (
        <FilterCategory formMethods={formMethods} />
      )}
      <RecordFilters
        defaultFilters={allDefaultFilters}
        filters={filters}
        more={more}
        moreSectionFilters={moreSectionFilters}
        primaryFilters={allPrimaryFilters}
        queryParams={queryParams}
        recordType={recordType}
        reset={reset}
        setMoreSectionFilters={setMoreSectionFilters}
        setReset={setReset}
      />
      <MoreSection
        allAvailable={filters}
        defaultFilters={allDefaultFilters}
        more={more}
        moreSectionFilters={moreSectionFilters}
        primaryFilters={allPrimaryFilters}
        recordType={recordType}
        setMore={setMore}
        setMoreSectionFilters={setMoreSectionFilters}
      />
    </div>
  );
}

TabFilters.displayName = "TabFilters";

TabFilters.propTypes = {
  formMethods: PropTypes.object,
  handleClear: PropTypes.func,
  handleSave: PropTypes.func,
  more: PropTypes.bool,
  moreSectionFilters: PropTypes.object,
  queryParams: PropTypes.object,
  recordType: PropTypes.string,
  reset: PropTypes.bool,
  setMore: PropTypes.func,
  setMoreSectionFilters: PropTypes.func,
  setReset: PropTypes.func
};

export default TabFilters;
