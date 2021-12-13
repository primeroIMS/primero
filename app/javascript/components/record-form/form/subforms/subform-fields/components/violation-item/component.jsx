import PropTypes from "prop-types";

import ViolationTitle from "../violation-title";

import { NAME } from "./constants";
import { getViolationTallyLabel } from "./utils";
import css from "./styles.css";

const Component = ({ fields, values, locale, displayName, index, collapsedFieldValues }) => {
  const currentValues = values[index];

  const violationTally = getViolationTallyLabel(fields, currentValues, locale);

  return (
    <div id="subform-header-button" className={css.subformViolationHeader}>
      <h2>
        <ViolationTitle title={displayName?.[locale]} values={currentValues} fields={fields} />
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
