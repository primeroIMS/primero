// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import Cancel from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// eslint-disable-next-line react/display-name
export default (value, successIcon) => {
  return value ? <CheckCircleIcon className={successIcon} /> : <Cancel />;
};
