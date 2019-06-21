import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  Button
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  CheckBox,
  SelectFilter,
  RangeButton
} from "components/filters-builder/filter-controls";
import filterTypes from "./mocked-filters";
import styles from "./styles.css";

const FiltersBuilder = () => {
  const css = makeStyles(styles)();

  const handleClearFilters = () => console.log("Clear Filters");

  const handleSaveFilters = () => console.log("Save Filters");

  const handleApplyFilter = () => console.log("Filters to Apply");

  const renderFilterControl = (type, options) => {
    switch (type) {
      case "checkbox":
        return <CheckBox props={options} />;
      case "multi_select":
        return <SelectFilter props={options} multiple />;
      case "select":
        return <SelectFilter props={options} />;
      case "multi_toogle":
        return <RangeButton props={options} />;
      case "radio":
        return <h2>RADIO</h2>;
      case "chips":
        return <h2>CHIPS</h2>;
      case "dates":
        return <h2>DATES</h2>;
      default:
        return <h2>Not Found</h2>;
    }
  };

  return (
    <div className={css.root}>
      <div className={css.actionButtons}>
        <Button color="primary" onClick={handleClearFilters}>
          Clear
        </Button>
        <Button color="primary" onClick={handleSaveFilters}>
          Save
        </Button>
        <Button color="primary" onClick={handleApplyFilter}>
          Apply
        </Button>
      </div>
      {filterTypes.map(f => (
        <ExpansionPanel className={css.panel}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id={f.id}
          >
            <Typography className={css.heading}>{f.display_name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={css.panelDetails}>
            {renderFilterControl(f.type, f.options)}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
};

export default FiltersBuilder;
