import React from "react";
import PropTypes from "prop-types";
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import FilterInput from "./filter-input";

const FiltersExpansionPanel = ({
  name,
  handleSetFilterValue,
  options,
  id,
  filterValues
}) => {
  return (
    <ExpansionPanel elevation={3} defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        {name}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <FilterInput
          handleSetFilterValue={handleSetFilterValue}
          name={name}
          options={options}
          id={id}
          filterValues={filterValues}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

FiltersExpansionPanel.displayName = "FiltersExpansionPanel";

FiltersExpansionPanel.defaultProps = {
  filterValues: {},
  options: []
};

FiltersExpansionPanel.propTypes = {
  filterValues: PropTypes.object,
  handleSetFilterValue: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array
};

export default FiltersExpansionPanel;
