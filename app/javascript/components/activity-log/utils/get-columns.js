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
            const activityData = {
              data: value,
              datetime: currentData[5],
              displayId: currentData[3],
              performedBy: currentData[4],
              recordAccessDenied: currentData[6],
              recordId: currentData[2],
              recordType: currentData[1],
              type: currentData[0]
            };

            return <ActivityItem activityData={activityData} />;
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
