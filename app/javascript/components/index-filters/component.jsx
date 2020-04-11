import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, FormContext } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import qs from "qs";
import isEmpty from "lodash/isEmpty";
import { useLocation } from "react-router-dom";
import { push } from "connected-react-router";
import { Tabs, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { fromJS } from "immutable";

import SavedSearches, { fetchSavedSearches } from "../saved-searches";
import SavedSearchesForm from "../saved-searches/SavedSearchesForm";
import { currentUser } from "../user";
import { useI18n } from "../i18n";
import { RECORD_PATH } from "../../config";

import { filterType, compactFilters } from "./utils";
import {
  HIDDEN_FIELDS,
  PRIMARY_FILTERS,
  MY_CASES_FILTER_NAME,
  OR_FILTER_NAME
} from "./constants";
import { Search } from "./components/filter-types";
import { getFiltersByRecordType } from "./selectors";
import { applyFilters, setFilters } from "./action-creators";
import Actions from "./components/actions";
import styles from "./components/styles.css";
import MoreSection from "./components/more-section";

const Component = ({ recordType, defaultFilters }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const [open, setOpen] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [moreSectionFilters, setMoreSectionFilters] = useState({});
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));
  const [more, setMore] = useState(false);
  const [reset, setReset] = useState(false);
  const dispatch = useDispatch();

  const methods = useForm({
    defaultValues: isEmpty(queryParams) ? defaultFilters.toJS() : queryParams
  });

  const filters = useSelector(state =>
    getFiltersByRecordType(state, recordType)
  );

  const userName = useSelector(state => currentUser(state));

  const allPrimaryFilters = filters.filter(f =>
    PRIMARY_FILTERS.includes(f.field_name)
  );
  const allDefaultFilters = filters.filter(f =>
    [...defaultFilters.keys()].includes(f.field_name)
  );

  const queryParamsKeys = Object.keys(queryParams);
  const moreSectionKeys = Object.keys(moreSectionFilters);
  const defaultFilterNames = allDefaultFilters.map(t => t.field_name);

  const isDateFieldFromValue = (field, keys) => {
    if (field.type !== "dates") {
      return false;
    }

    const datesOption = field?.options?.[i18n.locale];

    if (!datesOption) {
      return false;
    }

    return (
      datesOption?.filter(dateOption => keys.includes(dateOption.id))?.length >
      0
    );
  };

  const renderFilters = () => {
    let primaryFilters = filters;

    if (recordType === RECORD_PATH.cases) {
      const showMyCasesFilter = (field, keys) =>
        field.field_name === MY_CASES_FILTER_NAME &&
        keys.includes(OR_FILTER_NAME);

      const selectedFromMoreSection = primaryFilters.filter(
        f =>
          moreSectionKeys.includes(f.field_name) ||
          showMyCasesFilter(f, moreSectionKeys) ||
          isDateFieldFromValue(f, moreSectionKeys)
      );

      const queryParamsFilter = primaryFilters.filter(
        f =>
          !more &&
          (queryParamsKeys.includes(f.field_name) ||
            showMyCasesFilter(f, queryParamsKeys) ||
            isDateFieldFromValue(f, queryParamsKeys)) &&
          !(
            defaultFilterNames.includes(f.field_name) ||
            allPrimaryFilters.map(t => t.field_name).includes(f.field_name)
          )
      );

      const mergedFilters = fromJS([
        ...allPrimaryFilters,
        ...allDefaultFilters,
        ...queryParamsFilter,
        ...(!more ? selectedFromMoreSection : [])
      ]);

      primaryFilters = mergedFilters;
    }

    return primaryFilters.map(filter => {
      const Filter = filterType(filter.type);
      const secondary =
        moreSectionKeys.includes(filter.field_name) ||
        (filter.field_name === MY_CASES_FILTER_NAME &&
          moreSectionKeys.includes(OR_FILTER_NAME)) ||
        isDateFieldFromValue(filter, moreSectionKeys);

      const mode = {
        secondary,
        defaultFilter: defaultFilterNames.includes(filter.field_name)
      };

      if (!Filter) return null;

      return (
        <Filter
          key={filter.field_name}
          filter={filter}
          moreSectionFilters={moreSectionFilters}
          setMoreSectionFilters={setMoreSectionFilters}
          reset={reset}
          setReset={setReset}
          mode={mode}
        />
      );
    });
  };

  useEffect(() => {
    HIDDEN_FIELDS.forEach(field => methods.register({ name: field }));

    methods.setValue("fields", "short");

    return () => {
      HIDDEN_FIELDS.forEach(field => methods.unregister({ name: field }));
    };
  }, []);

  useEffect(() => {
    if (tabIndex === 1) {
      dispatch(fetchSavedSearches());
    }
  }, [tabIndex]);

  useEffect(() => {
    if (rerender) {
      const filtersToApply = isEmpty(queryParams)
        ? defaultFilters.toJS()
        : queryParams;

      Object.keys(methods.getValues()).forEach(value => {
        if (!Object.keys(filtersToApply).includes(value) && !isEmpty(value)) {
          methods.setValue(value, undefined);
        }
      });
      setMoreSectionFilters({});
      methods.reset(filtersToApply);
      dispatch(
        applyFilters({ recordType, data: compactFilters(filtersToApply) })
      );

      setRerender(false);
    }
  }, [rerender]);

  const tabs = [
    { name: i18n.t("saved_search.filters_tab"), selected: true },
    { name: i18n.t("saved_search.saved_searches_tab") }
  ];

  const handleSubmit = useCallback(data => {
    const payload = compactFilters(data);

    dispatch(applyFilters({ recordType, data: payload }));
  }, []);

  const handleSave = () => {
    setOpen(true);
  };

  const handleClear = useCallback(() => {
    methods.reset(defaultFilters.toJS());
    dispatch(setFilters({ recordType, data: defaultFilters.toJS() }));

    dispatch(push({}));
    dispatch(applyFilters({ recordType, data: defaultFilters.toJS() }));

    setMoreSectionFilters({});
    setReset(true);
    setMore(false);
  });

  return (
    <div className={css.root}>
      <FormContext {...methods} user={userName}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Search handleReset={handleClear} />
          <Tabs
            value={tabIndex}
            onChange={(event, value) => setTabIndex(value)}
            TabIndicatorProps={{
              style: {
                backgroundColor: "transparent"
              }
            }}
            classes={{ root: css.tabs }}
            variant="fullWidth"
          >
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
            <>
              <Actions handleSave={handleSave} handleClear={handleClear} />
              {renderFilters()}
              <MoreSection
                recordType={recordType}
                more={more}
                setMore={setMore}
                allAvailable={filters}
                primaryFilters={allPrimaryFilters}
                defaultFilters={allDefaultFilters}
                moreSectionFilters={moreSectionFilters}
                setMoreSectionFilters={setMoreSectionFilters}
              />
            </>
          )}
          {tabIndex === 1 && (
            <SavedSearches
              recordType={recordType}
              setTabIndex={setTabIndex}
              setRerender={setRerender}
            />
          )}
        </form>
      </FormContext>
      <SavedSearchesForm
        recordType={recordType}
        getValues={methods.getValues}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

Component.defaultProps = {
  defaultFilters: fromJS({})
};

Component.displayName = "IndexFilters";

Component.propTypes = {
  defaultFilters: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Component;
