import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const RangeButton = ({ exclusive, props, value, setValue }) => {
  const css = makeStyles(styles)();
  const { id, options } = props;
  const { values } = options;

  return (
    <Grid container spacing={2} direction="column" alignItems="center">
      <Grid item className={css.toggleContainer}>
        <ToggleButtonGroup
          exclusive={exclusive}
          value={value}
          onChange={(e, v) => setValue({ id, data: v })}
        >
          {values.map(v => (
            <ToggleButton key={v.id} value={v.id} className={css.toogleButton}>
              {v.display_name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

RangeButton.propTypes = {
  props: PropTypes.object.isRequired,
  options: PropTypes.object,
  exclusive: PropTypes.bool,
  id: PropTypes.string,
  value: PropTypes.string,
  setValue: PropTypes.func
};

const mapStateToProps = (state, obj) => ({
  value: Selectors.getRangeButton(state, obj.props)
});

const mapDispatchToProps = {
  setValue: actions.setValue
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RangeButton);
