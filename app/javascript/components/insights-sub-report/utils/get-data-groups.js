export default data =>
  data
    .map(elem => elem.get("group_id").split("-"))
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
