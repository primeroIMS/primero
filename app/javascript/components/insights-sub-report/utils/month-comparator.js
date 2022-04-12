import { MONTHS_TO_NUMBER } from "../../../config/constants";

export default (elem1, elem2) => {
  if (MONTHS_TO_NUMBER[elem1] === MONTHS_TO_NUMBER[elem2]) {
    return 0;
  }

  if (MONTHS_TO_NUMBER[elem1] > MONTHS_TO_NUMBER[elem2]) {
    return 1;
  }

  return -1;
};
