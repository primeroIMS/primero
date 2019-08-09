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
import filterTypes from "./mocked-filters";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const Filters = ({
  recordType,
  tabValue,
  setTabValue,
  setCheckBoxes,
  setSelect,
  setRangeButton,
  setRadioButtons,
  setChips,
  setDatesRange,
  setSwitch
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const resetPanels = () => {
    filterTypes.map(filter => {
      const payloadFilter = {};
      switch (filter.type) {
        case "checkbox":
          payloadFilter[filter.id] = [];
          return setCheckBoxes(payloadFilter, recordType);
        case "multi_select":
        case "select":
          payloadFilter[filter.id] = [];
          return setSelect(payloadFilter, recordType);
        case "multi_toggle":
          payloadFilter[filter.id] = [];
          return setRangeButton(payloadFilter, recordType);
        case "radio":
          payloadFilter[filter.id] = "";
          return setRadioButtons(payloadFilter, recordType);
        case "chips":
          payloadFilter[filter.id] = [];
          return setChips(payloadFilter, recordType);
        case "dates":
          payloadFilter[filter.id] = Map({
            from: null,
            to: null,
            value: ""
          });
          return setDatesRange(payloadFilter, recordType);
        case "switch":
          payloadFilter[filter.id] = [];
          return setSwitch(payloadFilter, recordType);
        default:
          return null;
      }
    });
  };

  useEffect(() => {
    resetPanels();
  }, []);

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
          filters={filterTypes}
          resetPanel={resetPanels}
        />
      )}
      {tabValue === 1 && <h1 style={{ textAlign: "center" }}>NYI</h1>}
    </div>
  );
};

Filters.propTypes = {
  recordType: PropTypes.string.isRequired,
  tabValue: PropTypes.number.isRequired,
  setTabValue: PropTypes.func,
  setCheckBoxes: PropTypes.func,
  setSelect: PropTypes.func,
  setRangeButton: PropTypes.func,
  setRadioButtons: PropTypes.func,
  setChips: PropTypes.func,
  setDatesRange: PropTypes.func,
  setSwitch: PropTypes.func
};

const mapStateToProps = (state, props) => ({
  tabValue: Selectors.getTab(state, props.recordType)
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
