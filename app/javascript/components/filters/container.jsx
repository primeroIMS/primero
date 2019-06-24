import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { FiltersBuilder } from "components/filters-builder";
import { withI18n } from "libs";
import { connect } from "react-redux";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";
import styles from "./styles.css";

const Filters = ({ tabValue, setTabValue }) => {
  const css = makeStyles(styles)();
  // const [tabValue, setTabValue] = React.useState(0);

  const handleTabsChange = (event, value) => setTabValue(value);

  return (
    <div className={css.root}>
      <AppBar position="static" color="default" classes={{ root: css.appbar }}>
        <Tabs
          value={tabValue}
          onChange={handleTabsChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: "transparent"
            }
          }}
          variant="fullWidth"
        >
          <Tab
            label="Filters"
            classes={{ root: css.tab, selected: css.tabselected }}
            selected
          />
          <Tab
            label="Saved Searches"
            classes={{ root: css.tab, selected: css.tabselected }}
          />
        </Tabs>
      </AppBar>
      {tabValue === 0 && <FiltersBuilder />}
      {tabValue === 1 && <h1 style={{ textAlign: "center" }}>NYI</h1>}
    </div>
  );
};

Filters.propTypes = {
  tabValue: PropTypes.number,
  setTabValue: PropTypes.func
};

const mapStateToProps = state => ({
  tabValue: Selectors.selectTab(state)
});

const mapDispatchToProps = {
  setTabValue: actions.setTab
};

export default withI18n(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Filters)
);
