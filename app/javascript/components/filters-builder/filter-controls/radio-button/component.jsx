import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import { RadioButtonChecked, RadioButtonUnchecked } from "@material-ui/icons";
import { useI18n } from "components/i18n";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const RadioButton = ({
  recordType,
  inline,
  props,
  radioButton,
  setRadioButton
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { id, options } = props;
  const { values } = options;
  const notTranslatedFilters = [];

  return (
    <div className={css.Root}>
      <RadioGroup
        aria-label={id}
        name={id}
        value={radioButton}
        onChange={e =>
          setRadioButton(
            {
              id,
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
            value={f.id}
            control={
              <Radio
                className={css.Checked}
                icon={<RadioButtonUnchecked fontSize="small" />}
                checkedIcon={<RadioButtonChecked fontSize="small" />}
              />
            }
            label={
              notTranslatedFilters.includes(id)
                ? f.display_name
                : i18n.t(`filters.${f.id}`)
            }
          />
        ))}
      </RadioGroup>
    </div>
  );
};

RadioButton.propTypes = {
  recordType: PropTypes.string.isRequired,
  props: PropTypes.object.isRequired,
  options: PropTypes.object,
  inline: PropTypes.bool,
  id: PropTypes.string,
  radioButton: PropTypes.string,
  setRadioButton: PropTypes.func
};

const mapStateToProps = (state, obj) => ({
  radioButton: Selectors.getRadioButtons(state, obj.props, obj.recordType)
});

const mapDispatchToProps = {
  setRadioButton: actions.setRadioButton
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RadioButton);
