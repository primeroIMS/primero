import { compareAsc, parseISO } from "date-fns";

export default (elem1, elem2) => {
  const date1 = parseISO(elem1.split(" - ")[0]);
  const date2 = parseISO(elem2.split(" - ")[0]);

  return compareAsc(date1, date2);
};
