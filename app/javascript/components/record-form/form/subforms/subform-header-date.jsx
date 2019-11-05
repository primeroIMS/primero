import React from "react";
import PropTypes from "prop-types";
import { parseISO, format } from "date-fns";
import isEmpty from "lodash/isEmpty";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "config";

const DateHeader = ({ value, includeTime }) => {
  if (isEmpty(value)) return value;

  const formattedDate = parseISO(value);
  const dateValue = includeTime
    ? format(formattedDate, DATE_TIME_FORMAT)
    : format(formattedDate, DATE_FORMAT);

  return <span>{dateValue}</span>;
};

DateHeader.propTypes = {
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  includeTime: PropTypes.bool
};

export default DateHeader;
