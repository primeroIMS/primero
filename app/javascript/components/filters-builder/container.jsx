import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Button,
  IconButton,
  Grid
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { RefreshIcon } from "images/primero-icons";
import {
  CheckBox,
  SelectFilter,
  RangeButton,
  RadioButton,
  Chips,
  DatesRange,
  SwitchButton
} from "components/filters-builder/filter-controls";
import { selectFilters } from "components/index-table";
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
      case "multi_toggle":
        return <RangeButton recordType={recordType} props={filter} />;
      case "radio":
        return <RadioButton recordType={recordType} props={filter} />;
      case "chips":
        return <Chips recordType={recordType} props={filter} />;
      case "dates":
        return <DatesRange recordType={recordType} props={filter} />;
      case "toggle":
        return <SwitchButton recordType={recordType} props={filter} />;
      default:
        return <h2>Not Found</h2>;
    }
  };

  const handleReset = (field, type) => event => {
    event.stopPropagation();
    resetCurrentPanel({ field_name: field, type }, recordType);
  };

  const allowedResetFilterTypes = ["radio", "multi_toggle", "chips"];

  return (
    <div className={css.root}>
      {filters &&
        filters.toJS().map(filter => (
          <ExpansionPanel
            expanded={expanded && expanded.includes(`${filter.field_name}`)}
            onChange={(e, isExpanded) =>
              setExpanded({
                expanded: isExpanded,
                panel: `${filter.field_name}`,
                namespace: recordType
              })
            }
            className={css.panel}
            key={filter.field_name}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="filter-controls-content"
              id={filter.field_name}
            >
              <div className={css.heading}>
                <span> {i18n.t(`${filter.name}`)} </span>
                {allowedResetFilterTypes.includes(filter.type) ? (
                  <IconButton
                    aria-label="Delete"
                    justifycontent="flex-end"
                    size="small"
                    onClick={handleReset(
                      `${filter.field_name}`,
                      `${filter.type}`
                    )}
                  >
                    <RefreshIcon />
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
  filters: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
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
