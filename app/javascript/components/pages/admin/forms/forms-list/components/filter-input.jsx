import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import styles from "../styles.css";

const FilterInput = ({
  handleSetFilterValue,
  options,
  name,
  filterValues,
  id: filterID
}) => {
  const css = makeStyles(styles)();

  const renderOptions = () =>
    options.map(option => {
      const { displayName, id } = option;

      return (
        <ToggleButton
          key={id}
          value={id}
          classes={{
            root: css.toggleButton,
            selected: css.toggleButtonSelected
          }}
        >
          {displayName}
        </ToggleButton>
      );
    });

  return (
    <ToggleButtonGroup
      name={name}
      color="primary"
      value={filterValues?.[filterID]}
      onChange={(event, value) => handleSetFilterValue(filterID, value)}
      size="small"
      exclusive
      classes={{ root: css.toggleContainer }}
    >
      {renderOptions()}
    </ToggleButtonGroup>
  );
};

FilterInput.displayName = "FilterInput";

FilterInput.defaultProps = {
  filterValues: {},
  options: []
};

FilterInput.propTypes = {
  filterValues: PropTypes.object,
  handleSetFilterValue: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array
};

export default FilterInput;
