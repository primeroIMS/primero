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

import { SavedSearches, fetchSavedSearches } from "../saved-searches";
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
  const dispatch = useDispatch();

  const methods = useForm({
    defaultValues: isEmpty(queryParams) ? defaultFilters.toJS() : queryParams
  });

  const filters = useSelector(state =>
    getFiltersByRecordType(state, recordType)
  );

  const userName = useSelector(state => currentUser(state));

  const pFilters = filters.filter(f => PRIMARY_FILTERS.includes(f.field_name));
  const defaultf = filters.filter(f =>
    [...defaultFilters.keys()].includes(f.field_name)
  );

  const moreSectionKeys = Object.keys(moreSectionFilters);

  const renderFilters = () => {
    let primaryFilters = filters;

    if (recordType === RECORD_PATH.cases) {
      const selectedFromMoreSection = primaryFilters.filter(
        f =>
          moreSectionKeys.includes(f.field_name) ||
          (f.field_name === MY_CASES_FILTER_NAME &&
            moreSectionKeys.includes(OR_FILTER_NAME))
      );
      const queryParamsFilter = primaryFilters.filter(
        f =>
          Object.keys(queryParams).includes(f.field_name) &&
          !(
            defaultf.map(t => t.field_name).includes(f.field_name) ||
            pFilters.map(t => t.field_name).includes(f.field_name)
          )
      );

      const mergedFilters = fromJS([
        ...pFilters,
        ...defaultf,
        ...queryParamsFilter,
        ...selectedFromMoreSection
      ]);

      primaryFilters = mergedFilters;
    }

    return primaryFilters.map(filter => {
      const Filter = filterType(filter.type);

      if (!Filter) return null;

      return (
        <Filter
          key={filter.field_name}
          filter={filter}
          moreSectionFilters={moreSectionFilters}
          setMoreSectionFilters={setMoreSectionFilters}
          isSecondary={
            moreSectionKeys.includes(filter.field_name) ||
            (filter.field_name === MY_CASES_FILTER_NAME &&
              moreSectionKeys.includes(OR_FILTER_NAME))
          }
        />
      );
    });
  };

  useEffect(() => {
    HIDDEN_FIELDS.forEach(field => methods.register({ name: field }));

    methods.setValue("fields", "short");

    dispatch(
      applyFilters({ recordType, data: compactFilters(methods.getValues()) })
    );

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
      dispatch(
        applyFilters({ recordType, data: compactFilters(methods.getValues()) })
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
  });

  return (
    <div className={css.root}>
      <FormContext {...methods} user={userName}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Search />
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
            {tabs.map(tab => (
              <Tab
                label={tab.name}
                key={tab.name}
                classes={{ root: css.tab, selected: css.tabselected }}
                selected={tab.selected}
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
                primaryFilters={pFilters}
                defaultFilters={defaultf}
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
