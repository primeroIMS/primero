// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildReportData from "./build-report-data";

describe("<InsightsSubReport />/utils/buildReportData", () => {
  context("when there is no data", () => {
    it("returns an empty array", () => {
      const result = buildReportData(fromJS({}), "incidents");

      expect(result).to.deep.equals(fromJS({}));
    });
  });

  context("when there is data", () => {
    it("returns sorted Map", () => {
      const result = buildReportData(
        fromJS({
          id: "gbv_statistics",
          name: "managed_reports.gbv_statistics.name",
          description: "managed_reports.gbv_statistics.description",
          module_id: "primeromodule-gbv",
          subreports: ["incidents", "perpetrators", "survivors"],
          report_data: {
            incidents: {
              data: {
                elapsed_reporting_time: [
                  {
                    group_id: "2022-04",
                    data: [
                      {
                        id: "2_weeks_1_month",
                        total: 1
                      }
                    ]
                  }
                ],
                total: [
                  {
                    group_id: "2022-04",
                    data: [
                      {
                        id: "incidents",
                        total: 2
                      }
                    ]
                  }
                ],
                incident_timeofday: [
                  {
                    group_id: "2022-04",
                    data: [
                      {
                        id: "morning",
                        total: 1
                      }
                    ]
                  }
                ]
              },
              metadata: {
                order: ["total", "incident_timeofday", "elapsed_reporting_time"],
                lookups: {
                  incident_timeofday: "lookup-gbv-incident-timeofday",
                  elapsed_reporting_time: "lookup-elapsed-reporting-time"
                }
              }
            }
          }
        }),
        "incidents"
      );

      expect([...result.keys()]).to.deep.equal(["single", "aggregate"]);
      expect([...result.get("single").keys()]).to.deep.equal(["total"]);
      expect([...result.get("aggregate").keys()]).to.deep.equal(["incident_timeofday", "elapsed_reporting_time"]);
    });
  });
});
