import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import styles from "./styles.css";

const RangeButton = ({ exclusive, props }) => {
  const css = makeStyles(styles)();
  const { values } = props;

  const [alignment, setAlignment] = React.useState(null);
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <Grid container spacing={2} direction="column" alignItems="center">
      <Grid item className={css.toggleContainer}>
        <ToggleButtonGroup
          exclusive={exclusive}
          value={alignment}
          onChange={handleAlignment}
        >
          {values.map(v => (
            <ToggleButton key={v.id} value={v.id} className={css.toogleButton}>
              {v.display_name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

RangeButton.propTypes = {
  props: PropTypes.array,
  values: PropTypes.array,
  exclusive: PropTypes.bool
};

export default RangeButton;
