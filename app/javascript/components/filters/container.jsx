import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { FiltersBuilder } from "components/filters-builder";
import styles from "./styles.css";

const Filters = () => {
  const css = makeStyles(styles)();
  const [tabValue, setTabValue] = React.useState(0);

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
      {/* TODO: Pass tabValue as a prop on each container
      to hide not to render every time tab changes */}
      {<FiltersBuilder show={tabValue === 0} />}
      {tabValue === 1 && <h1 style={{ textAlign: "center" }}>NYI</h1>}
    </div>
  );
};

export default Filters;
