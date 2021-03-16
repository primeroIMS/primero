import { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";

import { filterType } from "../../../../index-filters/utils";
import { currentUser } from "../../../../user";
import Actions from "../../../../index-filters/components/actions";
import { useMemoizedSelector } from "../../../../../libs";

import { NAME } from "./constants";

const Component = ({ filters, onSubmit, clearFields, defaultFilters }) => {
  const methods = useForm();

  const userName = useMemoizedSelector(state => currentUser(state));

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
    }
    onSubmit();
  };

  useEffect(() => {
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
    <div>
      <FormProvider {...methods} user={userName}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Actions handleClear={onClear} />
          {renderFilters()}
        </form>
      </FormProvider>
    </div>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  defaultFilters: {}
};

Component.propTypes = {
  clearFields: PropTypes.array.isRequired,
  defaultFilters: PropTypes.object,
  filters: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default Component;
