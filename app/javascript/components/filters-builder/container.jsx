import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Button,
  IconButton
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Refresh from "@material-ui/icons/Refresh";
import {
  CheckBox,
  SelectFilter,
  RangeButton,
  RadioButton,
  Chips,
  DatesRange
} from "components/filters-builder/filter-controls";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

import styles from "./styles.css";

const FiltersBuilder = ({ filters, expanded, setExpanded, resetPanel }) => {
  const css = makeStyles(styles)();

  const handleClearFilters = () => {
    resetPanel({ type: "all", panel: "all" });
  };

  const handleSaveFilters = () => console.log("Save Filters");

  const handleApplyFilter = () => console.log("Filters to Apply");

  const renderFilterControl = filter => {
    switch (filter.type) {
      case "checkbox":
        return <CheckBox props={filter} />;
      case "multi_select":
        return <SelectFilter props={filter} multiple />;
      case "select":
        return <SelectFilter props={filter} />;
      case "multi_toogle":
        return <RangeButton props={filter} exclusive />;
      case "radio":
        return <RadioButton props={filter} />;
      case "chips":
        return <Chips props={filter} />;
      case "dates":
        return <DatesRange props={filter} />;
      default:
        return <h2>Not Found</h2>;
    }
  };

  const handleReset = (panel, type) => event => {
    event.stopPropagation();
    resetPanel({ type, panel });
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
      {filters.map(filter => (
        <ExpansionPanel
          expanded={expanded && expanded.includes(`${filter.id}`)}
          onChange={(e, isExpanded) =>
            setExpanded({ expanded: isExpanded, panel: `${filter.id}` })
          }
          className={css.panel}
          key={filter.id}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="filter-controls-content"
            id={filter.id}
          >
            <div className={css.heading}>
              <span>{filter.display_name}</span>
              {filter.reset && filter.reset ? (
                <IconButton
                  aria-label="Delete"
                  justifycontent="flex-end"
                  size="small"
                  onClick={handleReset(`${filter.id}`, `${filter.type}`)}
                >
                  <Refresh fontSize="inherit" />
                </IconButton>
              ) : null}
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={css.panelDetails}>
            {renderFilterControl(filter)}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
};

FiltersBuilder.propTypes = {
  expanded: PropTypes.array.isRequired,
  filters: PropTypes.object,
  setExpanded: PropTypes.func,
  resetPanel: PropTypes.func
};

const mapStateToProps = state => ({
  expanded: Selectors.selectExpandedPanel(state)
});

const mapDispatchToProps = {
  setExpanded: actions.setExpandedPanel,
  resetPanel: actions.resetPanel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersBuilder);
