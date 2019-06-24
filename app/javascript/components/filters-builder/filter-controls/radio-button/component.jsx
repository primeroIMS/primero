import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import RadioButtonChecked from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import styles from "./styles.css";

const RadioButton = ({ props }) => {
  const css = makeStyles(styles)();
  const { values } = props;

  const [value, setValue] = React.useState(null);
  const handleChange = (event, newAlignment) => {
    setValue(event.target.value);
  };

  return (
    <div className={css.Root}>
      <RadioGroup
        aria-label="Gender"
        name="gender1"
        value={value}
        onChange={handleChange}
        // row
      >
        {values.map(f => (
          <FormControlLabel
            value={f.id}
            control={
              <Radio
                className={css.Checked}
                icon={<RadioButtonUnchecked fontSize="small" />}
                checkedIcon={<RadioButtonChecked fontSize="small" />}
              />
            }
            label={f.display_name} />
        ))}
      </RadioGroup>
    </div>
  );
};

RadioButton.propTypes = {
  props: PropTypes.array
};

export default RadioButton;
