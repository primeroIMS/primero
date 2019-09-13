import React from "react";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { FormGroup, FormControlLabel, Checkbox } from "@material-ui/core";
import { useI18n } from "components/i18n";
import { getOption } from "components/record-form/selectors";
import { isEmpty } from "lodash";
import { currentUser } from "components/pages/login/selectors";
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

  const userName = useSelector(state => currentUser(state));

  let values = [];
  values = useSelector(state => getOption(state, optionStringsSource, i18n));

  if (isEmpty(optionStringsSource) && Array.isArray(options)) {
    values = options;
  } else if (Object.keys(values).length <= 0) {
    values = options[i18n.locale];
  }
  if (isEmpty(values)) {
    switch (fieldName) {
      case "my_cases":
        values = [
          {
            id: "owned_by",
            value: userName,
            name: "my_cases[owned_by]",
            display_name: "My Cases"
          },
          {
            id: "assigned_user_names",
            value: userName,
            name: "my_cases[assigned_user_names]",
            display_name: "Cases referred to me"
          }
        ];
        break;
      case "last_updated_at":
        values = [
          {
            id: "01-Jan-0000.15-Jun-2019",
            display_name: "For 3+ months"
          }
        ];
        break;
      default:
        break;
    }
  }

  const isIncluded = (data, value, name) => {
    if (Array.isArray(data)) {
      return checkBoxes.includes(value);
    }
    // This is due to "my_cases" filter
    return Object.values(data[name]).includes(value);
  };

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
                  checked={
                    checkBoxes &&
                    isIncluded(checkBoxes, v.value || v.id, v.name)
                  }
                  onChange={event => {
                    setCheckBox(
                      {
                        fieldName: v.name || fieldName,
                        included: isIncluded(
                          checkBoxes,
                          event.target.value,
                          event.target.name
                        ),
                        data: event.target.value
                      },
                      recordType
                    );
                  }}
                  id={v.id}
                  value={v.value || v.id}
                  name={v.name || v.id}
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
  checkBoxes: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
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
