import { YEAR } from "../../insights/constants";

export default (data, groupedBy) => {
  if (groupedBy === YEAR) {
    return {
      years: data.reduce((acc, elem) => {
        const groupId = elem.get("group_id").toString();

        if (!acc.find(year => year === groupId)) {
          return acc.concat(groupId);
        }

        return acc;
      }, [])
    };
  }

  return data
    .map(elem => elem.get("group_id").toString().split("-"))
    .reduce(
      (acc, [group, year]) => {
        if (!acc.groups.find(elem => elem === group)) {
          acc.groups = acc.groups.concat(group);
        }

        if (!acc.years.find(elem => elem === year)) {
          acc.years = acc.years.concat(year);
        }

        return acc;
      },
      { years: [], groups: [] }
    );
};
