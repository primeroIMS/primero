import { Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { useI18n } from "../../../../../../i18n";
import { MATCH_VALUES } from "../../../../../../../config";
import useOptions from "../../../../../../form/use-options";

import { isTextField, getValueLabel } from "./utils";
import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ field, traceValue, caseValue, match }) => {
  const css = useStyles();
  const i18n = useI18n();
  const {
    display_name: displayName,
    option_strings_source: optionStringSource,
    option_strings_text: optionStringsText
  } = field;

  const options = useOptions({ source: optionStringSource, options: optionStringsText });

  const traceValueLabel = getValueLabel({ options, value: traceValue });
  const caseValueLabel = getValueLabel({ options, value: caseValue });

  const matched = match === MATCH_VALUES.match;
  const className = matched ? css.matched : css.notMatched;

  return (
    <Grid container item className={css.fieldRow}>
      <Grid item xs={2}>
        <span className={css.fieldTitle}>{displayName[i18n.locale]}</span>
      </Grid>
      <Grid item xs={4}>
        {traceValueLabel}
      </Grid>
      <Grid item xs={4}>
        {caseValueLabel}
      </Grid>
      <Grid item xs={2} className={className}>
        {!isTextField(field) && (matched && traceValue ? <CheckIcon /> : <ClearIcon />)}
      </Grid>
    </Grid>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  caseValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.object]),
  field: PropTypes.object.isRequired,
  match: PropTypes.string.isRequired,
  traceValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.object])
};

export default Component;
