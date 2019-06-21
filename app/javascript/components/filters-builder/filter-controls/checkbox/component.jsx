import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { FormGroup, FormControlLabel, Checkbox } from "@material-ui/core";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import styles from "./styles.css";

const CheckBox = ({ props }) => {
  const css = makeStyles(styles)();
  const { values } = props;

  // STATE MUST BE HANDLE BY REDUX
  const stateKeys = values
    .map(p => p.id)
    .reduce((acc, cur) => {
      acc[cur] = false;
      return acc;
    }, {});

  const [state, setState] = React.useState({
    stateKeys
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };
  return (
    <div>
      <FormGroup className={css.formGroup}>
        {values.map(v => (
          <FormControlLabel
            key={v.id}
            control={
              <Checkbox
                key={v.id}
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                checked={state.id}
                onChange={handleChange(v.id)}
                value={v.id}
                name={v.id}
                className={css.checkbox}
              />
            }
            label={v.display_name}
          />
        ))}
      </FormGroup>
    </div>
  );
};

CheckBox.propTypes = {
  props: PropTypes.object.isRequired,
  values: PropTypes.array
};

export default CheckBox;
