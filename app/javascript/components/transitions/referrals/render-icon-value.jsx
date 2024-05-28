// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import Cancel from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

// eslint-disable-next-line react/display-name
export default (value, successIcon) => {
  return value ? <CheckCircleIcon className={successIcon} /> : <Cancel />;
};
