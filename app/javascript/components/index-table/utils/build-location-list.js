import { LOOKUPS, STRING_SOURCES_TYPES } from "../../../config";

const buildLocationsList = (records, columnsWithLookups) => {
  const locationIDS = [];
  const locationFields = columnsWithLookups
    .filter(field =>
      [LOOKUPS.reporting_locations, STRING_SOURCES_TYPES.LOCATION].includes(field.get("option_strings_source"))
    )
    .map(field => [field.get("name"), field.get("option_strings_source")]);

  records.forEach(record => {
    locationFields.forEach(locationField => {
      locationIDS.push(record.get(locationField[0]));
      locationIDS.push(...(record.get("reporting_location_hierarchy")?.split(".") || []));
    });
  });

  return [...new Set(locationIDS)];
};

export default buildLocationsList;
