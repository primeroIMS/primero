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
    .reduce((acc, [year, group]) => {
      if (acc[year]) {
        return { ...acc, [year]: [...acc[year], group] };
      }

      return { ...acc, [year]: [group] };
    }, {});
};
