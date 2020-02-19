import React from "react";
import PropTypes from "prop-types";
import { parseISO, format } from "date-fns";
import isEmpty from "lodash/isEmpty";

import { SUBFORM_HEADER_DATE } from "../constants";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "../../../../../config";

const Component = ({ value, includeTime }) => {
  if (isEmpty(value)) return value || "";

  const formattedDate = parseISO(value);
  const dateValue = includeTime
    ? format(formattedDate, DATE_TIME_FORMAT)
    : format(formattedDate, DATE_FORMAT);

  return <span>{dateValue}</span>;
};

Component.displayName = SUBFORM_HEADER_DATE;

Component.propTypes = {
  includeTime: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
};

export default Component;
