import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import { RadioButtonChecked, RadioButtonUnchecked } from "@material-ui/icons";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const RadioButton = ({ inline, props, radioButton, setRadioButton }) => {
  const css = makeStyles(styles)();
  const { id, options } = props;
  const { values } = options;

  return (
    <div className={css.Root}>
      <RadioGroup
        aria-label="Gender"
        name={id}
        value={radioButton}
        onChange={e =>
          setRadioButton({
            id,
            data: e.target.value
          })
        }
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
  options: PropTypes.object,
  inline: PropTypes.bool,
  id: PropTypes.string,
  radioButton: PropTypes.string,
  setRadioButton: PropTypes.func
};

const mapStateToProps = (state, obj) => ({
  radioButton: Selectors.getRadioButtons(state, obj.props)
});

const mapDispatchToProps = {
  // setupRadioButtons: actions.setupRadioButton,
  setRadioButton: actions.setRadioButton
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RadioButton);
