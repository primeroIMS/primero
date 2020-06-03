import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useForm, FormContext } from "react-hook-form";

import { filterType } from "../../../../index-filters/utils";
import { currentUser } from "../../../../user";
import Actions from "../../../../index-filters/components/actions";

import { NAME } from "./constants";

const Component = ({ filters, onSubmit, clearFields, defaultFilters }) => {
  const methods = useForm();
  const userName = useSelector(state => currentUser(state));
  const defaultFiltersKeys = Object.keys(defaultFilters);
  const setDefaultFilters = () =>
    Object.entries(defaultFilters).forEach(defaultFilter => {
      const [key, value] = defaultFilter;

      methods.setValue(key, value);
    });

  const onClear = () => {
    if (defaultFiltersKeys.length) {
      setDefaultFilters();
    } else {
      clearFields.map(field => methods.setValue(field, undefined));
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

      if (!Filter) return null;

      return (
        <Filter
          key={filter.field_name}
          filter={filter}
          multiple={filter.multiple}
        />
      );
    });
  };

  return (
    <div>
      <FormContext {...methods} user={userName}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Actions handleClear={onClear} />
          {renderFilters()}
        </form>
      </FormContext>
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
