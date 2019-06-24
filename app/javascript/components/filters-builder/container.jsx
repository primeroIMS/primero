import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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
  RangeButton,
  RadioButton
} from "components/filters-builder/filter-controls";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";
import filterTypes from "./mocked-filters";
import styles from "./styles.css";

const FiltersBuilder = ({ expanded, setExpanded, removeExpandedPanel }) => {
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
        return <RangeButton props={options} exclusive />;
      case "radio":
        return <RadioButton props={options} />;
      case "chips":
        return <h2>CHIPS</h2>;
      case "dates":
        return <h2>DATES</h2>;
      default:
        return <h2>Not Found</h2>;
    }
  };

  const handleChange = panel => (event, isExpanded) => {
    if (isExpanded) {
      setExpanded(panel, isExpanded);
    } else {
      removeExpandedPanel(panel);
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
      {filterTypes.map((filter, index) => (
        <ExpansionPanel
          expanded={expanded && expanded.includes(`filterPanel${index}`)}
          onChange={handleChange(`filterPanel${index}`)}
          className={css.panel}
          key={filter.id}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="filter-controls-content"
            id={filter.id}
          >
            <Typography className={css.heading}>
              {filter.display_name}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={css.panelDetails}>
            {renderFilterControl(filter.type, filter.options)}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
};

FiltersBuilder.propTypes = {
  expanded: PropTypes.object.isRequired,
  setExpanded: PropTypes.func,
  removeExpandedPanel: PropTypes.func
};

const mapStateToProps = state => ({
  expanded: Selectors.selectExpandedPanel(state)
});

const mapDispatchToProps = {
  setExpanded: actions.setExpandedPanel,
  removeExpandedPanel: actions.removeExpandedPanel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersBuilder);
