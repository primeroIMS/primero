import React from "react";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import { RadioButtonChecked, RadioButtonUnchecked } from "@material-ui/icons";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../i18n";
import { getOption } from "../../../record-form/selectors";

import styles from "./styles.css";
import * as actions from "./action-creators";
import { getRadioButtons } from "./selectors";

const RadioButton = ({
  recordType,
  inline,
  props,
  radioButton,
  setRadioButton
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const {
    field_name: fieldName,
    options,
    option_strings_source: optionStringsSource
  } = props;
  let values = [];

  values = useSelector(state => getOption(state, optionStringsSource, i18n));

  if (isEmpty(optionStringsSource) && Array.isArray(options)) {
    values = options;
  } else if (Object.keys(values).length <= 0) {
    values = options[i18n.locale];
  }

  return (
    <div className={css.Root}>
      <RadioGroup
        aria-label={fieldName}
        name={fieldName}
        value={radioButton}
        onChange={e =>
          setRadioButton(
            {
              fieldName,
              data: e.target.value
            },
            recordType
          )
        }
        row={inline}
      >
        {values.map(f => (
          <FormControlLabel
            key={f.id}
            value={f.id.toString()}
            control={
              <Radio
                className={css.Checked}
                icon={<RadioButtonUnchecked fontSize="small" />}
                checkedIcon={<RadioButtonChecked fontSize="small" />}
              />
            }
            label={f.display_name || f.display_text}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

RadioButton.displayName = "RadioButton";

RadioButton.propTypes = {
  field_name: PropTypes.string,
  inline: PropTypes.bool,
  option_strings_source: PropTypes.string,
  options: PropTypes.object,
  props: PropTypes.object.isRequired,
  radioButton: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  setRadioButton: PropTypes.func
};

const mapStateToProps = (state, obj) => ({
  radioButton: getRadioButtons(state, obj)
});

const mapDispatchToProps = {
  setRadioButton: actions.setRadioButton
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RadioButton);
