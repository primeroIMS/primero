// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/display-name */
import { ActivityItem } from "../components";
import { COLUMN_NAMES } from "../constants";

export default () =>
  COLUMN_NAMES.map(name => {
    if (name === "data") {
      return {
        label: "",
        name: "data",
        options: {
          filter: false,
          sort: false,
          customHeadRender: () => null,
          customBodyRender: (value, tableMeta) => {
            const { rowIndex, tableData } = tableMeta;
            const currentData = tableData[rowIndex];

            return (
              <ActivityItem
                activityData={{
                  data: currentData.data,
                  displayId: currentData.display_id,
                  recordType: currentData.record_type,
                  recordId: currentData.record_id,
                  recordAccessDenied: currentData.record_access_denied,
                  performedBy: currentData.performed_by,
                  type: currentData.type,
                  datetime: currentData.datetime
                }}
              />
            );
          }
        }
      };
    }

    return {
      label: "",
      name,
      options: {
        display: false
      }
    };
  });
