import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../test-utils";

import InsightsSubReport from "./container";

describe("<InsightsSubReport />", () => {
  const initialState = fromJS({
    records: {
      insights: {
        selectedReport: {
          id: "ghn_report",
          name: "managed_reports.ghn_report.name",
          description: "managed_reports.ghn_report.description",
          module_id: "primeromodule-mrm",
          subreports: ["ghn_report"],
          report_data: {
            ghn_report: {
              data: {
                verified_information: [
                  {
                    group_id: "boys",
                    data: [
                      {
                        id: "killing",
                        total: 2
                      }
                    ]
                  },
                  {
                    group_id: "girls",
                    data: []
                  },
                  {
                    group_id: "unknown",
                    data: []
                  },
                  {
                    group_id: "total",
                    data: [
                      {
                        id: "killing",
                        total: 2
                      }
                    ]
                  }
                ],
                verified_information_violations: [],
                late_verification: [],
                late_verification_violations: [],
                unverified_information: [
                  {
                    group_id: "boys",
                    data: [
                      {
                        id: "killing",
                        total: 1
                      }
                    ]
                  },
                  {
                    group_id: "girls",
                    data: []
                  },
                  {
                    group_id: "unknown",
                    data: []
                  },
                  {
                    group_id: "total",
                    data: [
                      {
                        id: "killing",
                        total: 1
                      }
                    ]
                  }
                ],
                unverified_information_violations: [],
                multiple_violations: [
                  {
                    data: {
                      unique_id: "26c0dfd0-4731-41d2-a6f5-689370cca821",
                      violations: ["killing"],
                      incident_id: "bb763213-2202-4e3d-a302-05bc96ed599b",
                      individual_age: null,
                      individual_sex: "male",
                      incident_short_id: "21ac674"
                    }
                  }
                ]
              },
              metadata: {
                display_graph: false,
                lookups: {
                  multiple_violations: ["lookup-gender-unknown-total", "lookup-violation-type"]
                },
                table_type: "ghn_report",
                order: [
                  "verified_information",
                  "verified_information_violations",
                  "late_verification",
                  "late_verification_violations",
                  "unverified_information",
                  "unverified_information_violations",
                  "multiple_violations"
                ],
                indicators_rows: {},
                indicators_subcolumns: {}
              }
            }
          }
        }
      }
    }
  });

  it("should render a MultipleViolationsIndicator component", () => {
    mountedComponent(
      <InsightsSubReport />,
      initialState,
      {},
      ["/insights/primeromodule-mrm/ghn_report/ghn_report"],
      {},
      "/insights/:moduleID/:id/:subReport"
    );
    expect(screen.getByText("managed_reports.ghn_report.sub_reports.multiple_violations")).toBeInTheDocument();
  });
});
