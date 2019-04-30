import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";

const DateCell = ({ value }) => <>{format(value, "DD-MMM-YYYY")}</>;

DateCell.propTypes = {
  value: PropTypes.string
};

export default DateCell;
