import React from "react";
import Cancel from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

export default (value, successIcon) => {
  return value ? <CheckCircleIcon className={successIcon} /> : <Cancel />;
};
