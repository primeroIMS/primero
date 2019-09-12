import React from "react";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { FormGroup, FormControlLabel, Checkbox } from "@material-ui/core";
import { useI18n } from "components/i18n";
import { getOption } from "components/record-form/selectors";
import { isEmpty } from "lodash";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const CheckBox = ({ recordType, props, checkBoxes, setCheckBox }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const {
    field_name: fieldName,
    options,
    option_strings_source: optionStringsSource
  } = props;
  let values = [];

  if (!isEmpty(optionStringsSource)) {
    values = useSelector(state => getOption(state, optionStringsSource, i18n));
  } else if (Array.isArray(options)) {
    values = options;
  } else {
    values = options[i18n.locale];
  }

  return (
    <div>
      <FormGroup className={css.formGroup}>
        {values &&
          values.map(v => (
            <FormControlLabel
              key={v.id}
              control={
                <Checkbox
                  key={v.id}
                  checked={checkBoxes && checkBoxes.includes(v.id)}
                  onChange={event => {
                    setCheckBox(
                      {
                        fieldName,
                        included: checkBoxes.includes(event.target.value),
                        data: event.target.value
                      },
                      recordType
                    );
                  }}
                  value={v.id}
                  name={v.id}
                />
              }
              label={v.display_name || v.display_text}
            />
          ))}
      </FormGroup>
    </div>
  );
};

CheckBox.propTypes = {
  recordType: PropTypes.string.isRequired,
  props: PropTypes.object.isRequired,
  options: PropTypes.object,
  field_name: PropTypes.string,
  option_strings_source: PropTypes.string,
  checkBoxes: PropTypes.array,
  setCheckBox: PropTypes.func
};

const mapStateToProps = (state, obj) => ({
  checkBoxes: Selectors.getCheckBoxes(state, obj.props, obj.recordType)
});

const mapDispatchToProps = {
  setCheckBox: actions.setCheckBox
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckBox);
