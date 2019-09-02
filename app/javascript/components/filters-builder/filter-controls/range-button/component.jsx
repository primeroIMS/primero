/* eslint-disable camelcase */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import Box from "@material-ui/core/Grid";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const RangeButton = ({ recordType, props, value, setValue }) => {
  const css = makeStyles(styles)();
  const { field_name, options } = props;

  return (
    <Box className={css.toggleContainer}>
      <ToggleButtonGroup
        value={value}
        classes={{
          root: css.toggleContainer
        }}
        onChange={(e, v) => setValue({ field_name, data: v }, recordType)}
      >
        {options.map(v => (
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
  setValue: PropTypes.func
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
