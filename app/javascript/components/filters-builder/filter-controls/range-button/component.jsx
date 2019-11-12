import React from "react";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import Box from "@material-ui/core/Grid";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../i18n";
import { getOption } from "../../../record-form/selectors";
import { AGE_MAX } from "../../../../config";

import styles from "./styles.css";
import * as actions from "./action-creators";
import { getRangeButton } from "./selectors";

const RangeButton = ({ recordType, props, value, setValue }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
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

  const changeAgeRangesValue = v => {
    if (v.includes(" - ")) {
      return v.replace(" - ", "..");
    }
    if (v.includes("+")) {
      return v.replace("+", `..${AGE_MAX}`);
    }

    return "";
  };

  return (
    <Box className={css.toggleContainer}>
      <ToggleButtonGroup
        value={value}
        classes={{
          root: css.toggleContainer
        }}
        onChange={(e, v) => setValue({ fieldName, data: v }, recordType)}
      >
        {values &&
          values.map(v => {
            const isAgeRange =
              typeof v.id === "string" &&
              (v.id.includes(" - ") || v.id.includes("+"));
            const rangeValue = isAgeRange ? changeAgeRangesValue(v.id) : v.id;

            return (
              <ToggleButton
                key={`age_${rangeValue}`}
                value={rangeValue}
                classes={{
                  root: css.toggleButton,
                  selected: css.toggleButtonSelected
                }}
              >
                {v.display_name || v.display_text}
              </ToggleButton>
            );
          })}
      </ToggleButtonGroup>
    </Box>
  );
};

RangeButton.displayName = "RangeButton";

RangeButton.propTypes = {
  field_name: PropTypes.string,
  option_strings_source: PropTypes.string,
  options: PropTypes.object,
  props: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  setValue: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

const mapStateToProps = (state, obj) => ({
  value: getRangeButton(state, obj.props, obj.recordType)
});

const mapDispatchToProps = {
  setValue: actions.setValue
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RangeButton);
