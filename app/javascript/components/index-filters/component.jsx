import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import useForm, { FormContext } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import omitBy from "lodash/omitBy";
import qs from "qs";
import { useLocation } from "react-router-dom";
import { push } from "connected-react-router";
import { createPortal } from "react-dom";

import SavedSearchesForm from "../saved-searches/SavedSearchesForm";
import { currentUser } from "../user";

import { FILTER_TYPES } from "./constants";
import {
  CheckboxFilter,
  ChipsFilter,
  SwitchFilter,
  DateFilter,
  ToggleFilter,
  SelectFilter,
  Search
} from "./components/filter-types";
import { getFiltersByRecordType } from "./selectors";
import { applyFilters, setFilters } from "./action-creators";
import Actions from "./components/actions";

const HIDDEN_FIELDS = ["fields", "id_search", "query"];

const Component = ({ recordType, defaultFilters, searchRef }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));
  const dispatch = useDispatch();

  const methods = useForm({
    defaultValues: isEmpty(queryParams) ? defaultFilters.toJS() : queryParams
  });

  const filters = useSelector(state =>
    getFiltersByRecordType(state, recordType)
  );

  const userName = useSelector(state => currentUser(state));

  const filterType = type => {
    switch (type) {
      case FILTER_TYPES.CHECKBOX:
        return CheckboxFilter;
      case FILTER_TYPES.TOGGLE:
        return SwitchFilter;
      case FILTER_TYPES.MULTI_TOGGLE:
        return ToggleFilter;
      case FILTER_TYPES.DATES:
        return DateFilter;
      case FILTER_TYPES.CHIPS:
        return ChipsFilter;
      case FILTER_TYPES.MULTI_SELECT:
        return SelectFilter;
      default:
        return null;
    }
  };

  const renderFilters = () => {
    return filters.map(filter => {
      const Filter = filterType(filter.type);

      if (!Filter) return null;

      return <Filter filter={filter} key={filter.field_name} />;
    });
  };

  useEffect(() => {
    // HIDDEN_FIELDS.forEach(field => methods.register({ name: field }));
    dispatch(
      applyFilters({ recordType, data: omitBy(methods.getValues(), isEmpty) })
    );

    return () => {
      // HIDDEN_FIELDS.forEach(field => methods.unregister({ name: field }));
    };
  }, []);

  const handleSubmit = useCallback(data => {
    // const payload = omitBy(data, isEmpty);

    // dispatch(applyFilters({ recordType, data: payload }));
    console.log(JSON.stringify(data))
  }, []);

  const handleSave = () => {
    setOpen(true);
  };

  const handleClear = useCallback(() => {
    methods.reset(defaultFilters.toJS());
    dispatch(setFilters({ recordType, data: defaultFilters.toJS() }));

    dispatch(push({}));
    dispatch(applyFilters({ recordType, data: defaultFilters.toJS() }));
  });

  const RecordSearchPortal = ({ children }) => {
    if (!searchRef.current) return null;

    return createPortal(children, searchRef.current);
  };

  return (
    <FormContext {...methods} user={userName}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <RecordSearchPortal>
          <Search />
        </RecordSearchPortal>
        <Actions handleSave={handleSave} handleClear={handleClear} />
        {renderFilters()}
      </form>
      <SavedSearchesForm
        recordType={recordType}
        open={open}
        setOpen={setOpen}
      />
    </FormContext>
  );
};

Component.displayName = "IndexFilters";

Component.propTypes = {
  defaultFilters: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  searchRef: PropTypes.object.isRequired
};

export default Component;
