// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable camelcase */
import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";

import useOptions from "../../../../../../form/use-options";
import { getShortIdFromUniqueId } from "../../../../../../records/utils";

import { getVerifiedValue } from "./utils";
import { NAME, VIOLATION_STATUS } from "./constants";
import css from "./styles.css";

const Component = ({ title, values, fields }) => {
  const shortUniqueId = getShortIdFromUniqueId(values?.unique_id);
  const violationVerifiedField = fields.find(field => field.name === VIOLATION_STATUS);
  const optionsStrings = useOptions({ source: violationVerifiedField?.option_strings_source });
  const violationStatusLabel = getVerifiedValue(optionsStrings, values);
  const renderShortUniqueId = shortUniqueId ? `- ${shortUniqueId} ` : null;
  const renderChipStatus = violationStatusLabel ? (
    <Chip label={violationStatusLabel} size="small" className={css.chipStatus} />
  ) : null;

  return (
    <div className={css.container}>
      <div className={css.titleViolation}>
        {title} {renderShortUniqueId}
      </div>
      <div>{renderChipStatus}</div>
    </div>
  );
};

Component.propTypes = {
  fields: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired
};

Component.displayName = NAME;

export default Component;
