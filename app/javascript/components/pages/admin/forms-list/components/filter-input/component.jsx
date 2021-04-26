import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import styles from "../../styles.css";

const useStyles = makeStyles(styles);

const Component = ({ handleSetFilterValue, options, name, filterValues, id: filterID }) => {
  const css = useStyles();

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
  const handleChange = (event, value) => handleSetFilterValue(filterID, value);

  return (
    <ToggleButtonGroup
      name={name}
      color="primary"
      value={filterValues?.[filterID]}
      onChange={handleChange}
      size="small"
      exclusive
      disabled
      classes={{ root: css.toggleContainer }}
    >
      {renderOptions()}
    </ToggleButtonGroup>
  );
};

Component.displayName = "FilterInput";

Component.defaultProps = {
  filterValues: {},
  options: []
};

Component.propTypes = {
  filterValues: PropTypes.object,
  handleSetFilterValue: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array
};

export default Component;
