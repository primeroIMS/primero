import React from "react";
import { Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import isNil from "lodash/isNil";

import { useI18n } from "../../../../../../i18n";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ field, traceValue, caseValue }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { display_name: displayName } = field;

  const matched = (!isNil(traceValue) || !isNil(caseValue)) && traceValue === caseValue;
  const className = matched ? css.matched : css.notMatched;

  return (
    <Grid container item className={css.fieldRow}>
      <Grid item xs={2}>
        <strong>{displayName[i18n.locale]}</strong>
      </Grid>
      <Grid item xs={4}>
        {traceValue}
      </Grid>
      <Grid item xs={4}>
        {caseValue}
      </Grid>
      <Grid item xs={2} className={className}>
        {matched && traceValue ? <CheckIcon /> : <ClearIcon />}
      </Grid>
    </Grid>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  caseValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  field: PropTypes.object.isRequired,
  traceValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
};

export default Component;
