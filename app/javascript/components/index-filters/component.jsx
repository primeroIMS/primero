import { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, batch } from "react-redux";
import qs from "qs";
import isEmpty from "lodash/isEmpty";
import merge from "deepmerge";
import omit from "lodash/omit";
import { useLocation } from "react-router-dom";
import { push } from "connected-react-router";
import { Tabs, Tab } from "@material-ui/core";
import { fromJS } from "immutable";

import SavedSearches, { fetchSavedSearches } from "../saved-searches";
import SavedSearchesForm from "../saved-searches/SavedSearchesForm";
import { currentUser } from "../user";
import { useI18n } from "../i18n";
import { getReportingLocationConfig } from "../user/selectors";
import { DEFAULT_FILTERS } from "../record-list/constants";
import { overwriteMerge, useMemoizedSelector } from "../../libs";

import { DEFAULT_SELECTED_RECORDS_VALUE, FILTER_CATEGORY, HIDDEN_FIELDS, ID_SEARCH } from "./constants";
import { compactFilters, transformFilters } from "./utils";
import { Search } from "./components/filter-types";
import { applyFilters, setFilters } from "./action-creators";
import css from "./components/styles.css";
import TabFilters from "./components/tab-filters";

const Component = ({ recordType, defaultFilters, setSelectedRecords }) => {
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
  const [filterToList, setFilterToList] = useState(DEFAULT_FILTERS);
  const [moreSectionFilters, setMoreSectionFilters] = useState({});

  const defaultFiltersPlainObject = defaultFilters.toJS();

  const resetSelectedRecords = () => {
    setSelectedRecords(DEFAULT_SELECTED_RECORDS_VALUE);
  };

  const methods = useForm({
    defaultValues: merge({ ...defaultFiltersPlainObject, filter_category: FILTER_CATEGORY.incidents }, filterToList, {
      arrayMerge: overwriteMerge
    }),
    shouldUnregister: false
  });

  const reportingLocationConfig = useMemoizedSelector(state => getReportingLocationConfig(state));
  const userName = useMemoizedSelector(state => currentUser(state));

  const ownedByLocation = `${reportingLocationConfig.get("field_key")}${reportingLocationConfig.get("admin_level")}`;

  const addFilterToList = useCallback(data => setFilterToList({ ...filterToList, ...data }), [filterToList]);

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
      const filtersToApply = isEmpty(queryParams) ? defaultFiltersPlainObject : queryParams;

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
      setFilterToList(DEFAULT_FILTERS);
    }
  }, [rerender]);

  useEffect(() => {
    methods.reset({ ...transformFilters.split(queryParams), filter_category: methods.getValues("filter_category") });
  }, [queryString]);

  const tabs = [
    { name: i18n.t("saved_search.filters_tab"), selected: true },
    { name: i18n.t("saved_search.saved_searches_tab") }
  ];

  const handleSubmit = useCallback(data => {
    const payload = omit(transformFilters.combine(compactFilters(data)), "filter_category");

    resetSelectedRecords();
    dispatch(applyFilters({ recordType, data: payload }));
  }, []);

  const handleSave = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClear = useCallback(
    setIdSearch => {
      resetSelectedRecords();
      methods.reset({
        ...defaultFiltersPlainObject,
        filter_category: methods.getValues("filter_category"),
        ...(setIdSearch && { [ID_SEARCH]: true })
      });
      batch(() => {
        dispatch(setFilters({ recordType, data: defaultFiltersPlainObject }));
        dispatch(push({}));
      });

      setMoreSectionFilters({});
      setReset(true);
      setMore(false);
      setFilterToList(DEFAULT_FILTERS);
    },
    [recordType, defaultFiltersPlainObject]
  );

  const handleChangeTabs = (event, value) => setTabIndex(value);

  return (
    <div className={css.root}>
      <FormProvider {...methods} user={userName}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Search handleReset={handleClear} />
          <div className={css.tabContainer}>
            <Tabs value={tabIndex} onChange={handleChangeTabs} classes={{ root: css.tabs }} variant="fullWidth">
              {tabs.map(({ name, selected, ...rest }) => (
                <Tab
                  label={name}
                  key={name}
                  classes={{ root: css.tab, selected: css.tabselected }}
                  selected={selected}
                  {...rest}
                />
              ))}
            </Tabs>

            {tabIndex === 0 && (
              <TabFilters
                addFilterToList={addFilterToList}
                defaultFilters={defaultFilters}
                filterToList={filterToList}
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
};

Component.defaultProps = {
  defaultFilters: fromJS({})
};

Component.displayName = "IndexFilters";

Component.propTypes = {
  defaultFilters: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  setSelectedRecords: PropTypes.func
};

export default Component;
