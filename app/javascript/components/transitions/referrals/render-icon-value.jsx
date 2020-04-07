import React from "react";
import Cancel from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

// eslint-disable-next-line react/display-name
export default (value, successIcon) => {
  return value ? <CheckCircleIcon className={successIcon} /> : <Cancel />;
};
