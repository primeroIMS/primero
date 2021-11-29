import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";

import useOptions from "../../../../../../form/use-options";
import { getShortIdFromUniqueId } from "../../../../../../records/utils";

import { getVerifiedValue } from "./utils";
import { NAME, VIOLATION_STATUS } from "./constants";
import css from "./styles.css";

const Component = ({ title, values, fields }) => {
  const shortUniqueId = getShortIdFromUniqueId(values.unique_id);
  const violationVerifiedField = fields.find(field => field.name === VIOLATION_STATUS);
  // eslint-disable-next-line camelcase
  const optionsStrings = useOptions({ source: violationVerifiedField?.option_strings_source });
  const violationStatusLabel = getVerifiedValue(optionsStrings, values);

  return (
    <>
      {title} - {shortUniqueId} <Chip label={violationStatusLabel} size="small" className={css.chipStatus} />
    </>
  );
};

Component.propTypes = {
  fields: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired
};

Component.displayName = NAME;

export default Component;
