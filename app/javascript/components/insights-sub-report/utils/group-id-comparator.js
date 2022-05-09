import { YEAR } from "../../insights/constants";

import getGroupComparator from "./get-group-comparator";
import yearComparator from "./year-comparator";

export default groupedBy => {
  if (groupedBy === YEAR) {
    return (elem1, elem2) => yearComparator(elem1.get("group_id"), elem2.get("group_id"));
  }

  const groupComparator = getGroupComparator(groupedBy);

  return (elem1, elem2) => {
    const [year1, group1] = elem1.get("group_id").split("-");
    const [year2, group2] = elem2.get("group_id").split("-");

    const result = yearComparator(year1, year2);

    if (result === 0) {
      return groupComparator(group1, group2);
    }

    return result;
  };
};
