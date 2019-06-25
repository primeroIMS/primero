import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import RadioButtonChecked from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import styles from "./styles.css";

const RadioButton = ({ inline, props }) => {
  const css = makeStyles(styles)();
  const { values } = props;

  const [value, setValue] = React.useState("");
  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    <div className={css.Root}>
      <RadioGroup
        aria-label="Gender"
        name="gender1"
        value={value}
        onChange={handleChange}
        row={inline}
      >
        {values.map(f => (
          <FormControlLabel
            key={f.id}
            value={f.id}
            control={
              <Radio
                className={css.Checked}
                icon={<RadioButtonUnchecked fontSize="small" />}
                checkedIcon={<RadioButtonChecked fontSize="small" />}
              />
            }
            label={f.display_name}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

RadioButton.propTypes = {
  props: PropTypes.object.isRequired,
  values: PropTypes.array,
  inline: PropTypes.bool
};

export default RadioButton;
