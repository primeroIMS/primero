// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isNil from "lodash/isNil";

const formatFieldName = ({ name, adminLevel, optionStringsSource }) => {
  if (optionStringsSource === "Location") {
    return `loc:${name}${isNil(adminLevel) ? "" : adminLevel}`;
  }

  return name;
};

export default report => {
  return Object.entries(report).reduce((acc, curr) => {
    const [key, value] = curr;

    switch (key) {
      case "description":
        return { ...acc, [key]: value === null ? "" : value };
      case "fields": {
        const rows = value
          .filter(({ position }) => position.type === "horizontal")
          .map(({ name, admin_level: adminLevel, option_strings_source: optionStringsSource }) =>
            formatFieldName({ name, adminLevel, optionStringsSource })
          );
        const columns = value
          .filter(({ position }) => position.type === "vertical")
          .map(({ name, admin_level: adminLevel, option_strings_source: optionStringsSource }) =>
            formatFieldName({ name, adminLevel, optionStringsSource })
          );

        return { ...acc, aggregate_by: rows, disaggregate_by: columns };
      }
      default:
        return { ...acc, [key]: value };
    }
  }, {});
};
