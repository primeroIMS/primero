import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Tabs, Tab } from "@material-ui/core";
import { Map } from "immutable";
import { FiltersBuilder } from "components/filters-builder";
import {
  setUpCheckBoxes,
  setupSelect,
  setupRangeButton,
  setUpChips,
  setupRadioButtons,
  setupDatesRange,
  setSwitchButton
} from "components/filters-builder/filter-controls";
import { useI18n } from "components/i18n";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const Filters = ({
  recordType,
  defaultFilters,
  tabValue,
  setTabValue,
  setCheckBoxes,
  setSelect,
  setRangeButton,
  setRadioButtons,
  setChips,
  setDatesRange,
  setSwitch,
  availableFilters
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const resetPanels = () => {
    if (availableFilters) {
      const excludeDefaultFilters = [...defaultFilters.keys()];
      availableFilters.map(filter => {
        if (excludeDefaultFilters.includes(filter.field_name)) return null;

        const payloadFilter = {};
        switch (filter.type) {
          case "checkbox":
            if (filter.field_name === "my_cases") {
              payloadFilter["my_cases[owned_by]"] = [];
              setCheckBoxes(payloadFilter, recordType);
              payloadFilter["my_cases[assigned_user_names]"] = [];
              return setCheckBoxes(payloadFilter, recordType);
            }
            payloadFilter[filter.field_name] = [];
            return setCheckBoxes(payloadFilter, recordType);
          case "multi_select":
          case "select":
            payloadFilter[filter.field_name] = [];
            return setSelect(payloadFilter, recordType);
          case "multi_toggle":
            payloadFilter[filter.field_name] = [];
            return setRangeButton(payloadFilter, recordType);
          case "radio":
            payloadFilter[filter.field_name] = "";
            return setRadioButtons(payloadFilter, recordType);
          case "chips":
            payloadFilter[filter.field_name] = [];
            return setChips(payloadFilter, recordType);
          case "dates":
            payloadFilter[filter.field_name] = Map({
              from: null,
              to: null,
              value: ""
            });
            return setDatesRange(payloadFilter, recordType);
          case "toggle":
            payloadFilter[filter.field_name] = [];
            return setSwitch(payloadFilter, recordType);
          default:
            return null;
        }
      });
    }
  };

  useEffect(() => {
    resetPanels();
  }, [availableFilters]);

  const tabs = [
    { name: i18n.t("saved_search.filters_tab"), selected: true },
    { name: i18n.t("saved_search.saved_searches_tab") }
  ];

  return (
    <div className={css.root}>
      <Tabs
        value={tabValue}
        onChange={(e, value) => setTabValue({ recordType, value })}
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
          resetPanel={resetPanels}
        />
      )}
      {tabValue === 1 && <h1 style={{ textAlign: "center" }}>NYI</h1>}
    </div>
  );
};

Filters.propTypes = {
  recordType: PropTypes.string.isRequired,
  defaultFilters: PropTypes.object,
  tabValue: PropTypes.number.isRequired,
  setTabValue: PropTypes.func,
  setCheckBoxes: PropTypes.func,
  setSelect: PropTypes.func,
  setRangeButton: PropTypes.func,
  setRadioButtons: PropTypes.func,
  setChips: PropTypes.func,
  setDatesRange: PropTypes.func,
  setSwitch: PropTypes.func,
  availableFilters: PropTypes.object
};

const mapStateToProps = (state, props) => ({
  tabValue: Selectors.getTab(state, props.recordType),
  availableFilters: Selectors.getFiltersByRecordType(state, props.recordType)
});

const mapDispatchToProps = {
  setTabValue: actions.setTab,
  setCheckBoxes: setUpCheckBoxes,
  setSelect: setupSelect,
  setRangeButton: setupRangeButton,
  setRadioButtons: setupRadioButtons,
  setChips: setUpChips,
  setDatesRange: setupDatesRange,
  setSwitch: setSwitchButton
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
