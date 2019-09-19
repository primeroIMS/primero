import React from "react";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import { getOption } from "components/record-form/selectors";
import { isEmpty } from "lodash";
import Box from "@material-ui/core/Grid";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

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
          values.map(v => (
            <ToggleButton
              key={v.id}
              value={v.id}
              classes={{
                root: css.toggleButton,
                selected: css.toggleButtonSelected
              }}
            >
              {v.display_name || v.display_text}
            </ToggleButton>
          ))}
      </ToggleButtonGroup>
    </Box>
  );
};

RangeButton.propTypes = {
  recordType: PropTypes.string.isRequired,
  props: PropTypes.object.isRequired,
  options: PropTypes.object,
  field_name: PropTypes.string,
  value: PropTypes.array,
  setValue: PropTypes.func,
  option_strings_source: PropTypes.string
};

const mapStateToProps = (state, obj) => ({
  value: Selectors.getRangeButton(state, obj.props, obj.recordType)
});

const mapDispatchToProps = {
  setValue: actions.setValue
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RangeButton);
