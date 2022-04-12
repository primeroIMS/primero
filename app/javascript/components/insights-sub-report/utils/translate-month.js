import { MONTHS_TO_NUMBER } from "../../../config/constants";

export default (key, localizeDate) => {
  const monthNumber = MONTHS_TO_NUMBER[key] - 1;
  const dummyDate = new Date(2022, monthNumber, 1, 0, 0, 0);

  return localizeDate(dummyDate, "MMM");
};
