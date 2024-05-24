// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { QUARTERS_TO_NUMBER } from "../../../config/constants";

export default (elem1, elem2) => {
  if (QUARTERS_TO_NUMBER[elem1] === QUARTERS_TO_NUMBER[elem2]) {
    return 0;
  }

  if (QUARTERS_TO_NUMBER[elem1] > QUARTERS_TO_NUMBER[elem2]) {
    return 1;
  }

  return -1;
};
