import React from "react";
import PropTypes from "prop-types";

const DateCell = ({ value }) => {
  return <>{value}</>;
};

DateCell.propTypes = {
  value: PropTypes.string
};

export default DateCell;
