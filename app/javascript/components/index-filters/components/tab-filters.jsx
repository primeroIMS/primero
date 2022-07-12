import { useWatch } from "react-hook-form";
import PropTypes from "prop-types";

import { useMemoizedSelector } from "../../../libs";
import { MODULES } from "../../../config";
import { hasPrimeroModule } from "../../user";
import { getFiltersByRecordType } from "../selectors";
import { PRIMARY_FILTERS } from "../constants";

import MoreSection from "./more-section";
import Actions from "./actions";
import RecordFilters from "./record-filters";
import css from "./styles.css";
import FilterCategory from "./filter-category";

const TabFilters = ({
  addFilterToList,
  defaultFilters,
  filterToList,
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
}) => {
  const filterCategory = useWatch({ control: formMethods.control, name: "filter_category" });
  const filters = useMemoizedSelector(state => getFiltersByRecordType(state, recordType, filterCategory));
  const hasPrimeroModuleMRM = useMemoizedSelector(state => hasPrimeroModule(state, MODULES.MRM));
  const allPrimaryFilters = filters.filter(filter => PRIMARY_FILTERS.includes(filter.field_name));
  const allDefaultFilters = filters.filter(filter => [...defaultFilters.keys()].includes(filter.field_name));

  return (
    <div className={css.tabContent}>
      <Actions handleSave={handleSave} handleClear={handleClear} />
      {hasPrimeroModuleMRM && <FilterCategory formMethods={formMethods} />}
      <RecordFilters
        addFilterToList={addFilterToList}
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
        addFilterToList={addFilterToList}
        allAvailable={filters}
        defaultFilters={allDefaultFilters}
        filterToList={filterToList}
        more={more}
        moreSectionFilters={moreSectionFilters}
        primaryFilters={allPrimaryFilters}
        recordType={recordType}
        setMore={setMore}
        setMoreSectionFilters={setMoreSectionFilters}
      />
    </div>
  );
};

TabFilters.displayName = "TabFilters";

TabFilters.propTypes = {
  addFilterToList: PropTypes.func,
  defaultFilters: PropTypes.object,
  filterToList: PropTypes.object,
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
