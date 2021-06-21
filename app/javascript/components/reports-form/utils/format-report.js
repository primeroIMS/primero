export default report => {
  return Object.entries(report).reduce((acc, curr) => {
    const [key, value] = curr;

    switch (key) {
      case "description":
        return { ...acc, [key]: value === null ? "" : value };
      case "fields": {
        const rows = value
          .filter(({ position }) => position.type === "horizontal")
          .map(({ name, admin_level: adminLevel }) => `${name}${adminLevel || ""}`);
        const columns = value
          .filter(({ position }) => position.type === "vertical")
          .map(({ name, admin_level: adminLevel }) => `${name}${adminLevel || ""}`);

        return { ...acc, aggregate_by: rows, disaggregate_by: columns };
      }
      default:
        return { ...acc, [key]: value };
    }
  }, {});
};
