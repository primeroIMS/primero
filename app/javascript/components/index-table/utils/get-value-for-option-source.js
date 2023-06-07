export default ({
  value,
  useReportingLocations,
  fieldName,
  reportingLocationConfig,
  recordReportingLocationHierarchy
}) => {
  if (useReportingLocations === true && fieldName === reportingLocationConfig?.get("field_key")) {
    return recordReportingLocationHierarchy?.split(".")[reportingLocationConfig?.get("admin_level")];
  }

  return value;
};
