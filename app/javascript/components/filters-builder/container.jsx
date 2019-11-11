import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Button,
  IconButton
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { RefreshIcon } from "../../images/primero-icons";
import SavedSearchesForm from "../saved-searches/SavedSearchesForm";
import { getFilters } from "../index-table";
import { useI18n } from "../i18n";

import {
  CheckBox,
  SelectFilter,
  RangeButton,
  RadioButton,
  Chips,
  DatesRange,
  SwitchButton
} from "./filter-controls";
import * as actions from "./action-creators";
import { selectFiltersByRecordType } from "./selectors";
import Panel from "./Panel";
import styles from "./styles.css";

const FiltersBuilder = ({
  recordType,
  filters,
  resetPanel,
  resetCurrentPanel,
  recordFilters,
  applyFilters,
  defaultFilters
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const [open, setOpen] = useState(false);

  const handleClearFilters = () => {
    resetPanel();
  };

  const handleApplyFilter = () => {
    applyFilters({
      namespace: recordType,
      options: recordFilters,
      path: `/${recordType.toLowerCase()}`
    });
  };

  const handleSaveFilters = () => {
    setOpen(true);
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

  const savedSearchesFormProps = {
    recordType,
    open,
    setOpen
  };

  const allowedResetFilterTypes = ["radio", "multi_toggle", "chips"];

  const savedFilters = useSelector(state =>
    selectFiltersByRecordType(state, recordType)
  );

  const filterValues = filter => {
    const { field_name: fieldName } = filter;

    return (
      defaultFilters.get(fieldName)?.length > 0 ||
      savedFilters[fieldName]?.length > 0
    );
  };

  return (
    <div className={css.root}>
      {filters &&
        filters.toJS().map(filter => (
          <Panel
            key={`${recordType}-${filter.field_name}`}
            name={`${recordType}-${filter.field_name}`}
            hasValues={filterValues(filter)}
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
          </Panel>
        ))}
      <div className={css.actionButtons}>
        <Button variant="contained" color="primary" onClick={handleApplyFilter}>
          {i18n.t("filters.apply_filters")}
        </Button>
        <Button variant="outlined" onClick={handleSaveFilters}>
          {i18n.t("filters.save_filters")}
        </Button>
        <Button variant="outlined" onClick={handleClearFilters}>
          {i18n.t("filters.clear_filters")}
        </Button>
      </div>
      <SavedSearchesForm {...savedSearchesFormProps} />
    </div>
  );
};

FiltersBuilder.propTypes = {
  applyFilters: PropTypes.func,
  defaultFilters: PropTypes.object,
  filters: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  recordFilters: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  resetCurrentPanel: PropTypes.func,
  resetPanel: PropTypes.func
};

const mapStateToProps = (state, props) => ({
  recordFilters: getFilters(state, props.recordType)
});

const mapDispatchToProps = {
  resetCurrentPanel: actions.resetSinglePanel,
  applyFilters: actions.applyFilters
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersBuilder);
