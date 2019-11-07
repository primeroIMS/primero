import React from "react";
import PropTypes from "prop-types";
import { parseISO, format } from "date-fns";
import isEmpty from "lodash/isEmpty";

import { DATE_FORMAT, DATE_TIME_FORMAT } from "../../../../config";

import { DATE_HEADER_NAME } from "./constants";

const DateHeader = ({ value, includeTime }) => {
  if (isEmpty(value)) return value;

  const formattedDate = parseISO(value);
  const dateValue = includeTime
    ? format(formattedDate, DATE_TIME_FORMAT)
    : format(formattedDate, DATE_FORMAT);

  return <span>{dateValue}</span>;
};

DateHeader.displayName = DATE_HEADER_NAME;

DateHeader.propTypes = {
  includeTime: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
};

export default DateHeader;
