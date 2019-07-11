import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { useI18n } from "components/i18n";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const RangeButton = ({ recordType, exclusive, props, value, setValue }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { id, options } = props;
  const { values } = options;

  return (
    <Grid container spacing={2} direction="column" alignItems="center">
      <Grid item className={css.toggleContainer}>
        <ToggleButtonGroup
          exclusive={exclusive}
          value={value}
          onChange={(e, v) => setValue({ id, data: v }, recordType)}
        >
          {values.map(v => (
            <ToggleButton key={v.id} value={v.id} className={css.toogleButton}>
              {i18n.t(`${recordType.toLowerCase()}.filter_by.${v.id}`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

RangeButton.propTypes = {
  recordType: PropTypes.string.isRequired,
  props: PropTypes.object.isRequired,
  options: PropTypes.object,
  exclusive: PropTypes.bool,
  id: PropTypes.string,
  value: PropTypes.string,
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
