// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default ({
  value,
  useReportingLocations,
  fieldName,
  reportingLocationConfig,
  recordReportingLocationHierarchy
}) => {
  if (useReportingLocations === true && fieldName === reportingLocationConfig?.get("field_key")) {
    return recordReportingLocationHierarchy?.split(".")[
      reportingLocationConfig?.get("record_list_admin_level", reportingLocationConfig?.get("admin_level"))
    ];
  }

  return value;
};
