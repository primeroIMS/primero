import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { getLookupByUniqueId } from "../../../../../../form/selectors";
import { useI18n } from "../../../../../../i18n";
import { MATCH_VALUES } from "../../../../../../../config";

import { isTextField, getValueLabel } from "./utils";
import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ field, traceValue, caseValue, match }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const {
    display_name: displayName,
    option_strings_source: optionStringSource,
    option_strings_text: optionStringsText
  } = field;

  const lookup = useSelector(
    state => optionStringSource && getLookupByUniqueId(state, optionStringSource.replace(/lookup /, ""))
  );

  const options = lookup || optionStringsText;

  const traceValueLabel = getValueLabel({ options, i18n, value: traceValue });
  const caseValueLabel = getValueLabel({ options, i18n, value: caseValue });

  const matched = match === MATCH_VALUES.match;
  const className = matched ? css.matched : css.notMatched;

  return (
    <Grid container item className={css.fieldRow}>
      <Grid item xs={2}>
        <strong>{displayName[i18n.locale]}</strong>
      </Grid>
      <Grid item xs={4}>
        {traceValueLabel}
      </Grid>
      <Grid item xs={4}>
        {caseValueLabel}
      </Grid>
      <Grid item xs={2} className={className}>
        {isTextField(field) && (matched && traceValue ? <CheckIcon /> : <ClearIcon />)}
      </Grid>
    </Grid>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  caseValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  field: PropTypes.object.isRequired,
  match: PropTypes.string.isRequired,
  traceValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
};

export default Component;
