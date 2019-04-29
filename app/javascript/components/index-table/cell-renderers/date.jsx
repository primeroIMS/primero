import React from "react";
import { format } from "date-fns";

const DateCell = ({ value }) => format(value, "DD-MMM-YYYY");

export default DateCell;
