import { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FilterListIcon from "@material-ui/icons/FilterList";

import { useDrawer } from "../../../drawer";
import { filterType } from "../../../index-filters/utils";
import { currentUser } from "../../../user";
import FilterContainer from "../../../record-list/filter-container";
import Actions from "../../../index-filters/components/actions";
import { useMemoizedSelector, useThemeHelper } from "../../../../libs";

import { FILTERS_DRAWER, NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({
  closeDrawerOnSubmit,
  filters,
  onSubmit,
  clearFields,
  defaultFilters,
  initialFilters,
  showDrawer
}) => {
  const css = useStyles();
  const methods = useForm();

  const { mobileDisplay } = useThemeHelper();

  const userName = useMemoizedSelector(state => currentUser(state));

  const { drawerOpen, toggleDrawer, setDrawer } = useDrawer(FILTERS_DRAWER);

  const showFilterIcon = mobileDisplay && showDrawer && (
    <IconButton onClick={toggleDrawer} color="primary">
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
    onSubmit();
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
    <div className={css.recordFormFilters}>
      {showFilterIcon}
      <FilterContainer drawer={drawerOpen} handleDrawer={toggleDrawer} mobileDisplay={mobileDisplay && showDrawer}>
        <div className={css.filtersContainer}>
          <FormProvider {...methods} user={userName}>
            <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
              <Actions handleClear={onClear} />
              {renderFilters()}
            </form>
          </FormProvider>
        </div>
      </FilterContainer>
    </div>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  closeDrawerOnSubmit: false,
  defaultFilters: {},
  initialFilters: {},
  mobileDisplay: false,
  showDrawer: false
};

Component.propTypes = {
  clearFields: PropTypes.array.isRequired,
  closeDrawerOnSubmit: PropTypes.bool,
  defaultFilters: PropTypes.object,
  filters: PropTypes.array.isRequired,
  initialFilters: PropTypes.object,
  mobileDisplay: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  showDrawer: PropTypes.bool
};

export default Component;
