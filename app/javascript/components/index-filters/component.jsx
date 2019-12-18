import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import useForm, { FormContext } from "react-hook-form";
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

import { filterType, compactFilters } from "./utils";
import { HIDDEN_FIELDS } from "./constants";
import { Search } from "./components/filter-types";
import { getFiltersByRecordType } from "./selectors";
import { applyFilters, setFilters } from "./action-creators";
import Actions from "./components/actions";
import styles from "./components/styles.css";

const Component = ({ recordType, defaultFilters }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const [open, setOpen] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
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

  const renderFilters = () => {
    return filters.map(filter => {
      const Filter = filterType(filter.type);

      if (!Filter) return null;

      return <Filter filter={filter} key={filter.field_name} />;
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
