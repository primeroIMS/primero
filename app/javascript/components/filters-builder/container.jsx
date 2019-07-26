import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Button,
  IconButton,
  Grid
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
import { selectFilters } from "components/record-list";
import { useI18n } from "components/i18n";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

import styles from "./styles.css";

const FiltersBuilder = ({
  recordType,
  filters,
  expanded,
  setExpanded,
  resetPanel,
  resetCurrentPanel,
  collapsePanels,
  recordFilters,
  applyFilters
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const handleClearFilters = () => {
    resetPanel();
    collapsePanels();
  };

  // TODO: This need to be changed to store filters and apply selected
  // Filters depending on each record type
  const handleApplyFilter = () => {
    applyFilters({
      namespace: recordType,
      options: recordFilters,
      path: `/${recordType.toLowerCase()}`
    });
  };

  const renderFilterControl = filter => {
    switch (filter.type) {
      case "checkbox":
        return <CheckBox recordType={recordType} props={filter} />;
      case "multi_select":
        return <SelectFilter recordType={recordType} props={filter} multiple />;
      case "select":
        return <SelectFilter recordType={recordType} props={filter} />;
      case "multi_toogle":
        return <RangeButton recordType={recordType} props={filter} exclusive />;
      case "radio":
        return <RadioButton recordType={recordType} props={filter} />;
      case "chips":
        return <Chips recordType={recordType} props={filter} />;
      case "dates":
        return <DatesRange recordType={recordType} props={filter} />;
      default:
        return <h2>Not Found</h2>;
    }
  };

  const handleReset = (id, type) => event => {
    event.stopPropagation();
    resetCurrentPanel({ id, type }, recordType);
  };

  return (
    <div className={css.root}>
      {filters.map(filter => (
        <ExpansionPanel
          expanded={expanded && expanded.includes(`${filter.id}`)}
          onChange={(e, isExpanded) =>
            setExpanded({
              expanded: isExpanded,
              panel: `${filter.id}`,
              namespace: recordType
            })
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
              <span> {i18n.t(`filters.${filter.id}`)} </span>
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
      <div className={css.actionButtons}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyFilter}
          >
            {i18n.t("filters.apply_filters")}
          </Button>
          <Button variant="outlined" onClick={handleClearFilters}>
            {i18n.t("filters.clear_filters")}
          </Button>
        </Grid>
      </div>
    </div>
  );
};

FiltersBuilder.propTypes = {
  recordType: PropTypes.string.isRequired,
  expanded: PropTypes.array.isRequired,
  filters: PropTypes.array,
  setExpanded: PropTypes.func,
  resetPanel: PropTypes.func,
  resetCurrentPanel: PropTypes.func,
  collapsePanels: PropTypes.func,
  recordFilters: PropTypes.object,
  applyFilters: PropTypes.func
};

const mapStateToProps = (state, props) => ({
  expanded: Selectors.selectExpandedPanel(state, props.recordType),
  recordFilters: selectFilters(state, props.recordType)
});

const mapDispatchToProps = {
  setExpanded: actions.setExpandedPanel,
  resetCurrentPanel: actions.resetSinglePanel,
  collapsePanels: actions.collapsePanels,
  applyFilters: actions.applyFilters
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersBuilder);
