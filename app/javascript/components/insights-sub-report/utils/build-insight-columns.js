import getGroupComparator from "./get-group-comparator";
import yearComparator from "./year-comparator";
import getDataGroups from "./get-data-groups";
import translateGroups from "./translate-groups";

export default (value, localizeDate) => {
  if (value.some(elem => elem.get("group_id"))) {
    const { years, groups } = getDataGroups(value);

    const groupComparator = getGroupComparator(groups);

    const translatedGroups = translateGroups(groups.sort(groupComparator), localizeDate);

    return [
      { items: years.sort(yearComparator), colspan: groups.length },
      { items: translatedGroups, addEmptyCell: false }
    ];
  }

  return [];
};
