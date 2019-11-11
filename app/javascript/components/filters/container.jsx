import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Tabs, Tab } from "@material-ui/core";
import { Map, List } from "immutable";

import { FiltersBuilder } from "../filters-builder";
import { SavedSearches, fetchSavedSearches } from "../saved-searches";
import { useI18n } from "../i18n";

import { setInitialFilterValues, setTab } from "./action-creators";
import styles from "./styles.css";
import * as Selectors from "./selectors";

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

const Filters = ({ recordType, defaultFilters }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const tabValue = useSelector(state => Selectors.getTab(state, recordType));
  const availableFilters = useSelector(state =>
    Selectors.getFiltersByRecordType(state, recordType)
  );

  const resetFilterValues = useCallback(() => {
    if (availableFilters) {
      const excludeDefaultFilters = [...defaultFilters.keys()];

      const initialFilterValues = availableFilters.reduce((obj, item) => {
        const o = obj;
        const { field_name: fieldName, type: filterType } = item;

        if (!excludeDefaultFilters.includes(item.fieldName)) {
          if (ARRAY_FILTERS.includes(filterType)) {
            if (fieldName === "my_cases") {
              o["my_cases[owned_by]"] = List([]);
              o["my_cases[assigned_user_names]"] = List([]);
            } else {
              o[fieldName] = List([]);
            }
          }

          if (STRING_FILTERS.includes(filterType)) {
            o[fieldName] = "";
          }

          if (DATE_RANGE_FILTERS.includes(filterType)) {
            o[item.field_name] = Map({
              from: null,
              to: null,
              value: ""
            });
          }
        }

        return o;
      }, {});

      dispatch(setInitialFilterValues(recordType, initialFilterValues));
    }
  });

  useEffect(() => {
    resetFilterValues();
    dispatch(fetchSavedSearches());
  }, [availableFilters, dispatch, resetFilterValues]);

  const tabs = [
    { name: i18n.t("saved_search.filters_tab"), selected: true },
    { name: i18n.t("saved_search.saved_searches_tab") }
  ];

  return (
    <div className={css.root}>
      <Tabs
        value={tabValue}
        onChange={(e, value) => dispatch(setTab({ recordType, value }))}
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
        <FiltersBuilder
          recordType={recordType}
          filters={availableFilters}
          resetPanel={resetFilterValues}
          defaultFilters={defaultFilters}
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

Filters.propTypes = {
  defaultFilters: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Filters;
