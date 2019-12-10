import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Tabs, Tab } from "@material-ui/core";
import { fromJS } from "immutable";

import IndexFilters from "../index-filters";
import { SavedSearches, fetchSavedSearches } from "../saved-searches";
import { useI18n } from "../i18n";
import {
  FiltersBuilder,
  getFromDashboardFilters,
  clearDashboardFilters
} from "../filters-builder";
import { dataToJS } from "../../libs";

import {
  setInitialFilterValues,
  setInitialRecords,
  setTab
} from "./action-creators";
import { NAME } from "./constants";
import { getTab, getFiltersByRecordType } from "./selectors";
import styles from "./styles.css";

const ARRAY_FILTERS = [
  "checkbox",
  "select",
  "multi_select",
  "multi_toggle",
  "select",
  "chips",
  "toggle"
];

const STRING_FILTERS = ["radio"];

const DATE_RANGE_FILTERS = ["dates"];

const Container = ({
  recordType,
  defaultFilters,
  fromDashboard,
  searchRef
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const tabValue = useSelector(state => getTab(state, recordType));
  const availableFilters = useSelector(state =>
    getFiltersByRecordType(state, recordType)
  );

  const dashboardFilters = useSelector(state =>
    getFromDashboardFilters(state, recordType)
  );

  const resetFilterValues = useCallback((namespace = null, path = null) => {
    if (availableFilters) {
      const excludeDefaultFilters = [...defaultFilters.keys()];

      const initialFilterValues = availableFilters.reduce((obj, item) => {
        const currentObject = obj;
        const { field_name: fieldName, type: filterType } = item;

        if (!excludeDefaultFilters.includes(item.fieldName)) {
          if (ARRAY_FILTERS.includes(filterType)) {
            if (fieldName === "my_cases") {
              currentObject["or[owned_by]"] = fromJS([]);
              currentObject["or[assigned_user_names]"] = fromJS([]);
            } else {
              currentObject[fieldName] = fromJS([]);
            }
          }

          if (STRING_FILTERS.includes(filterType)) {
            currentObject[fieldName] = "";
          }

          if (DATE_RANGE_FILTERS.includes(filterType)) {
            currentObject[item.field_name] = fromJS({
              from: null,
              to: null,
              value: ""
            });
          }
        }

        return currentObject;
      }, {});

      dispatch(
        setInitialFilterValues(
          recordType,
          initialFilterValues,
          dataToJS(dashboardFilters)
        )
      );

      if (fromDashboard && dashboardFilters?.size) {
        dispatch(clearDashboardFilters(recordType));
      }

      if (namespace && path) {
        dispatch(setInitialRecords(path, namespace, initialFilterValues));
      }
    }
  });

  useEffect(() => {
    resetFilterValues();
    dispatch(fetchSavedSearches());
  }, [availableFilters]);

  const tabs = [
    { name: i18n.t("saved_search.filters_tab"), selected: true },
    { name: i18n.t("saved_search.saved_searches_tab") }
  ];

  return (
    <div className={css.root}>
      <Tabs
        value={tabValue}
        onChange={(event, value) => dispatch(setTab({ recordType, value }))}
        TabIndicatorProps={{
          style: {
            backgroundColor: "transparent"
          }
        }}
        classes={{ root: css.tabs }}
        variant="fullWidth"
      >
        {tabs.map(tab => (
          <Tab
            label={tab.name}
            key={tab.name}
            classes={{ root: css.tab, selected: css.tabselected }}
            selected={tab.selected}
          />
        ))}
      </Tabs>
      {tabValue === 0 && (
        <IndexFilters
          recordType={recordType}
          defaultFilters={defaultFilters}
          searchRef={searchRef}
        />
      )}
      {tabValue === 1 && (
        <SavedSearches
          recordType={recordType}
          resetFilters={resetFilterValues}
        />
      )}
    </div>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  defaultFilters: PropTypes.object,
  fromDashboard: PropTypes.bool,
  recordType: PropTypes.string.isRequired,
  searchRef: PropTypes.object.isRequired
};

export default Container;
