// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import { IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

import { useDrawer } from "../../../drawer";
import { filterType } from "../../../index-filters/utils";
import { currentUser } from "../../../user";
import FilterContainer from "../../../record-list/components/filter-container";
import Actions from "../../../index-filters/components/actions";
import { useMemoizedSelector, useThemeHelper } from "../../../../libs";
import SearchBox from "../../../index-filters/components/search-box";

import { FILTERS_DRAWER, NAME } from "./constants";
import css from "./styles.css";

function Component({
  closeDrawerOnSubmit = false,
  filters,
  onSubmit,
  clearFields,
  defaultFilters = {},
  initialFilters = {},
  showDrawer = false,
  noMargin = false,
  searchFieldLabel,
  showSearchField = false
}) {
  const methods = useForm();

  const { mobileDisplay } = useThemeHelper();

  const userName = useMemoizedSelector(state => currentUser(state));

  const { drawerOpen, toggleDrawer, setDrawer } = useDrawer(FILTERS_DRAWER);

  const showFilterIcon = mobileDisplay && showDrawer && (
    <IconButton size="large" onClick={toggleDrawer} color="primary">
      <FilterListIcon />
    </IconButton>
  );

  const defaultFiltersKeys = Object.keys(defaultFilters);
  const setDefaultFilters = () =>
    Object.entries(defaultFilters).forEach(defaultFilter => {
      const [key, value] = defaultFilter;

      methods.setValue(key, value);
    });

  const onClear = () => {
    clearFields.map(field => methods.setValue(field, undefined));
    if (defaultFiltersKeys.length) {
      setDefaultFilters();
      methods.reset(initialFilters);
    }
    onSubmit(clearFields.reduce((acc, field) => ({ ...acc, [field]: undefined }), {}));
  };

  const handleOnSubmit = data => {
    onSubmit(data);

    if (showDrawer && mobileDisplay && closeDrawerOnSubmit) {
      setDrawer(false);
    }
  };

  useEffect(() => {
    methods.reset(initialFilters);
    if (defaultFiltersKeys.length) {
      setDefaultFilters();
    }
  }, []);

  const renderFilters = () => {
    return filters.map(filter => {
      const Filter = filterType(filter.type);

      if (!Filter || filter.permitted_filter === false) return null;

      return <Filter key={filter.field_name} filter={filter} multiple={filter.multiple} />;
    });
  };

  return (
    <div className={css.recordFormFilters} data-testid="form-filter">
      {showFilterIcon}
      <FilterContainer
        drawer={drawerOpen}
        handleDrawer={toggleDrawer}
        mobileDisplay={mobileDisplay && showDrawer}
        noMargin={noMargin}
      >
        <div className={css.filtersContainer} role="form">
          <FormProvider {...methods} user={userName}>
            <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
              {showSearchField && (
                <SearchBox showSearchNameToggle={false} searchFieldLabel={searchFieldLabel} useFullWidth={noMargin} />
              )}
              <Actions handleClear={onClear} />
              {renderFilters()}
            </form>
          </FormProvider>
        </div>
      </FilterContainer>
    </div>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  clearFields: PropTypes.array.isRequired,
  closeDrawerOnSubmit: PropTypes.bool,
  defaultFilters: PropTypes.object,
  filters: PropTypes.array.isRequired,
  initialFilters: PropTypes.object,
  mobileDisplay: PropTypes.bool,
  noMargin: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  searchFieldLabel: PropTypes.string,
  showDrawer: PropTypes.bool,
  showSearchField: PropTypes.bool
};

export default Component;
