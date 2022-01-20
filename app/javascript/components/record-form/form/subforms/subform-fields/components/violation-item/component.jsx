import PropTypes from "prop-types";
import { ListItemText } from "@material-ui/core";

import ViolationTitle from "../violation-title";
import css from "../../../styles.css";

import { NAME } from "./constants";
import { getViolationTallyLabel } from "./utils";

const Component = ({ fields, values, locale, displayName, index, collapsedFieldValues }) => {
  const currentValues = values[index];

  const violationTally = getViolationTallyLabel(fields, currentValues, locale);

  return (
    <ListItemText
      id="subform-header-button"
      classes={{ primary: css.listText, secondary: css.listTextSecondary }}
      secondary={
        <div id="subform-violation-fields">
          {violationTally}
          <br />
          {collapsedFieldValues}
        </div>
      }
    >
      <ViolationTitle title={displayName?.[locale]} values={currentValues} fields={fields} />
    </ListItemText>
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
