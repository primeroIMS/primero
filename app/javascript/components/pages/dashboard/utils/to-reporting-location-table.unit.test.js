import { fromJS } from "immutable";

import toReportingLocationTable from "./to-reporting-location-table";

describe("toReportingLocationTable - pages/dashboard/utils/", () => {
  it("should convert the data for the table", () => {
    const locations = fromJS([
      {
        id: 1,
        code: "1506060",
        type: "sub_district",
        name: { en: "My District" }
      }
    ]);

    const data = fromJS({
      name: "dashboard.reporting_location",
      type: "indicator",
      indicators: {
        reporting_location_open: {
          "1506060": {
            count: 1,
            query: [
              "record_state=true",
              "status=open",
              "owned_by_location2=1506060"
            ]
          }
        },
        reporting_location_open_last_week: {
          "1506060": {
            count: 0,
            query: [
              "record_state=true",
              "status=open",
              "created_at=2019-12-25T00:00:00Z..2019-12-31T23:59:59Z",
              "owned_by_location2=1506060"
            ]
          }
        },
        reporting_location_open_this_week: {
          "1506060": {
            count: 1,
            query: [
              "record_state=true",
              "status=open",
              "created_at=2020-01-01T00:00:00Z..2020-01-08T19:32:20Z",
              "owned_by_location2=1506060"
            ]
          }
        },
        reporting_location_closed_last_week: {
          "1506060": {
            count: 0,
            query: [
              "record_state=true",
              "status=closed",
              "created_at=2019-12-25T00:00:00Z..2019-12-31T23:59:59Z",
              "owned_by_location2=1506060"
            ]
          }
        },
        reporting_location_closed_this_week: {
          "1506060": {
            count: 0,
            query: [
              "record_state=true",
              "status=closed",
              "created_at=2020-01-01T00:00:00Z..2020-01-08T19:32:20Z",
              "owned_by_location2=1506060"
            ]
          }
        }
      }
    });

    const expected = [
      {
        "": "My District",
        reporting_location_closed_last_week: 0,
        reporting_location_closed_this_week: 0,
        reporting_location_open: 1,
        reporting_location_open_last_week: 0,
        reporting_location_open_this_week: 1
      }
    ];

    const i18nMock = { t: () => ({}), locale: "en" };

    const converted = toReportingLocationTable(
      data,
      "district",
      i18nMock,
      locations
    ).data;

    expect(converted).to.deep.equal(expected);
  });
});
