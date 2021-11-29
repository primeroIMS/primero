import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";

import useOptions from "../../../../../../form/use-options";

import { NAME, VIOLATION_STATUS } from "./constants";
import { getViolationTallyLabel, getShortUniqueId, getVerifiedValue } from "./utils";
import css from "./styles.css";

const Component = ({ fields, values, locale, displayName, index, collapsedFieldValues }) => {
  const currentValues = values[index];
  const violationVerifiedField = fields.find(f => f.name === VIOLATION_STATUS);
  const optionsStrings = useOptions({ source: violationVerifiedField.option_strings_source });

  const shortUniqueId = getShortUniqueId(currentValues);
  const violationTally = getViolationTallyLabel(fields, currentValues, locale);
  const violationStatusLabel = getVerifiedValue(optionsStrings, currentValues);

  return (
    <div id="subform-header-button" className={css.subformViolationHeader}>
      <h2>
        {displayName?.[locale]} - {shortUniqueId}{" "}
        <Chip label={violationStatusLabel} size="small" className={css.chipStatus} />
      </h2>
      <div id="subform-violation-fields" className={css.subformViolationHeaderFields}>
        {violationTally}
        <br />
        {collapsedFieldValues}
      </div>
    </div>
  );
};

Component.propTypes = {
  collapsedFieldValues: PropTypes.node,
  displayName: PropTypes.object,
  fields: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  locale: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired
};

Component.displayName = NAME;

export default Component;
