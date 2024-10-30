// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, batch } from "react-redux";
import qs from "qs";
import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import { useLocation } from "react-router-dom";
import { push } from "connected-react-router";
import { Tabs, Tab } from "@mui/material";
import { fromJS } from "immutable";

import SavedSearches, { fetchSavedSearches } from "../saved-searches";
import SavedSearchesForm from "../saved-searches/SavedSearchesForm";
import { currentUser } from "../user";
import { useI18n } from "../i18n";
import { getReportingLocationConfig } from "../user/selectors";
import { DEFAULT_FILTERS } from "../record-list/constants";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import { reduceMapToObject } from "../../libs/component-helpers";

import { DEFAULT_SELECTED_RECORDS_VALUE, FILTER_CATEGORY, HIDDEN_FIELDS } from "./constants";
import { compactFilters, removeSearchIdParams, transformFilters } from "./utils";
import SearchBox from "./components/search-box";
import { applyFilters, setFilters } from "./action-creators";
import css from "./components/styles.css";
import TabFilters from "./components/tab-filters";

const tabs = [{ name: "saved_search.filters_tab", selected: true }, { name: "saved_search.saved_searches_tab" }];

function Component({ recordType, setSelectedRecords, metadata }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const location = useLocation();

  const queryString = location.search.replace("?", "");
  const queryParams = qs.parse(queryString);

  const [open, setOpen] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [more, setMore] = useState(false);
  const [reset, setReset] = useState(false);
  const [moreSectionFilters, setMoreSectionFilters] = useState({});

  const defaultFiltersForClear = reduceMapToObject(fromJS(DEFAULT_FILTERS).merge(metadata));

  const resetSelectedRecords = () => {
    setSelectedRecords(DEFAULT_SELECTED_RECORDS_VALUE);
  };

  const methods = useForm({
    defaultValues: { ...DEFAULT_FILTERS, filter_category: FILTER_CATEGORY.incidents },
    shouldUnregister: false
  });

  const reportingLocationConfig = useMemoizedSelector(state => getReportingLocationConfig(state));
  const userName = useMemoizedSelector(state => currentUser(state));

  const ownedByLocation = `${reportingLocationConfig.get("field_key")}${reportingLocationConfig.get("admin_level")}`;

  useEffect(() => {
    [...HIDDEN_FIELDS, ownedByLocation].forEach(field => methods.register({ name: field }));

    methods.setValue("fields", "short");

    return () => {
      [...HIDDEN_FIELDS, ownedByLocation].forEach(field => methods.unregister({ name: field }));
    };
  }, []);

  useEffect(() => {
    if (tabIndex === 1) {
      dispatch(fetchSavedSearches());
    }
  }, [tabIndex]);

  useEffect(() => {
    if (rerender) {
      const filtersToApply = isEmpty(queryParams) ? DEFAULT_FILTERS : queryParams;

      Object.keys(methods.getValues()).forEach(value => {
        if (!Object.keys(filtersToApply).includes(value) && !isEmpty(value)) {
          methods.setValue(value, undefined);
        }
      });
      setMoreSectionFilters({});
      methods.reset({ ...filtersToApply, filter_category: FILTER_CATEGORY.incidents });
      resetSelectedRecords();
      dispatch(applyFilters({ recordType, data: compactFilters(filtersToApply) }));

      setRerender(false);
    }
  }, [rerender]);

  useEffect(() => {
    if (methods.reset && queryString) {
      methods.reset({
        query: null,
        phonetic: null,
        ...transformFilters.split(queryParams),
        filter_category: methods.getValues("filter_category")
      });
    }
  }, [methods.reset, queryString]);

  const handleSubmit = useCallback(data => {
    const payload = removeSearchIdParams(omit(transformFilters.combine(compactFilters(data)), "filter_category"));

    resetSelectedRecords();
    dispatch(
      applyFilters({ recordType, data: { ...payload, ...(payload.query ? { query: payload.query?.trim() } : {}) } })
    );
  }, []);

  const handleSave = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClear = useCallback(() => {
    resetSelectedRecords();
    methods.reset({
      ...defaultFiltersForClear,
      filter_category: methods.getValues("filter_category")
    });
    batch(() => {
      dispatch(setFilters({ recordType, data: defaultFiltersForClear }));
      dispatch(push({}));
    });

    setMoreSectionFilters({});
    setReset(true);
    setMore(false);
  }, [recordType, defaultFiltersForClear]);

  const handleChangeTabs = (_event, value) => setTabIndex(value);

  return (
    <div className={css.root} data-testid="filters">
      <FormProvider {...methods} user={userName}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <SearchBox />
          <div className={css.tabContainer}>
            <Tabs value={tabIndex} onChange={handleChangeTabs} classes={{ root: css.tabs }} variant="fullWidth">
              {tabs.map(({ name, selected, ...rest }) => (
                <Tab
                  label={i18n.t(name)}
                  key={name}
                  classes={{ root: css.tab, selected: css.tabselected }}
                  selected={selected}
                  {...rest}
                />
              ))}
            </Tabs>

            {tabIndex === 0 && (
              <TabFilters
                handleClear={handleClear}
                handleSave={handleSave}
                more={more}
                formMethods={methods}
                moreSectionFilters={moreSectionFilters}
                queryParams={queryParams}
                recordType={recordType}
                reset={reset}
                setMore={setMore}
                setMoreSectionFilters={setMoreSectionFilters}
                setReset={setReset}
              />
            )}
            {tabIndex === 1 && (
              <div className={css.tabContent}>
                <SavedSearches recordType={recordType} setTabIndex={setTabIndex} setRerender={setRerender} />
              </div>
            )}
          </div>
        </form>
      </FormProvider>
      <SavedSearchesForm recordType={recordType} getValues={methods.getValues} open={open} setOpen={setOpen} />
    </div>
  );
}

Component.displayName = "IndexFilters";

Component.propTypes = {
  metadata: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  setSelectedRecords: PropTypes.func
};

export default Component;
