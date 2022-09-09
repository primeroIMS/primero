import { Route } from "react-router-dom";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";
import TableValues from "../charts/table-values";

import InsightsSubReport from "./container";

describe("<InsightsSubReport />", () => {
  let component;
  const initialState = fromJS({
    records: {
      insights: {
        selectedReport: {
          id: "violations",
          name: "managed_reports.violations.name",
          description: "managed_reports.violations.description",
          module_id: "primeromodule-mrm",
          subreports: ["killing", "maiming"],
          report_data: {
            killing: {
              data: {
                violation: [
                  {
                    group_id: "2022-Q2",
                    data: [
                      {
                        id: "boys",
                        total: 2
                      },
                      {
                        id: "girls",
                        total: 2
                      },
                      {
                        id: "total",
                        total: 5
                      }
                    ]
                  }
                ],
                perpetrators: [
                  {
                    group_id: "2022-Q2",
                    data: [
                      {
                        id: "armed_force_1",
                        boys: 1,
                        total: 2,
                        unknown: 1
                      }
                    ]
                  }
                ]
              },
              metadata: {
                display_graph: true,
                lookups: {
                  perpetrators: "lookup-armed-force-group-or-other-party",
                  violation: "lookup-violation-tally-options"
                },
                table_type: "default",
                order: ["violation", "perpetrators"]
              }
            }
          }
        },
        filters: {
          grouped_by: "quarter",
          date_range: "this_quarter",
          date: "incident_date",
          subreport: "detention"
        },
        loading: false,
        errors: false
      }
    },
    forms: {
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-violation-tally-options",
            name: {
              en: "Violation Tally Options"
            },
            values: [
              {
                id: "boys",
                display_text: {
                  en: "Boys"
                }
              },
              {
                id: "girls",
                display_text: {
                  en: "Girls"
                }
              },
              {
                id: "total",
                display_text: {
                  en: "Total"
                }
              }
            ]
          },
          {
            id: 2,
            unique_id: "lookup-armed-force-group-or-other-party",
            name: {
              en: "Violation Tally Options"
            },
            values: [
              {
                id: "armed_force_1",
                display_text: {
                  en: "Armed Force 1"
                }
              }
            ]
          }
        ]
      }
    }
  });

  beforeEach(() => {
    const routedComponent = initialProps => {
      return (
        <Route
          path="/insights/:moduleID/:id/:subReport"
          component={propsRoute => <InsightsSubReport {...{ ...propsRoute, ...initialProps }} />}
        />
      );
    };

    ({ component } = setupMountedComponent(routedComponent, {}, initialState, [
      "/insights/primeromodule-mrm/violations/killing"
    ]));
  });

  it("should render <InsightsSubReport /> component", () => {
    expect(component.find(InsightsSubReport)).to.have.lengthOf(1);
  });

  it("should render <h2 /> component", () => {
    const title = component.find(InsightsSubReport).find("h2");

    expect(title).to.have.lengthOf(1);
    expect(title.text()).to.be.equal("managed_reports.violations.description");
  });

  it("should render <TableValues /> component", () => {
    expect(component.find(TableValues)).to.have.lengthOf(2);
  });

  it("should render <h3 /> component", () => {
    expect(component.find("h3")).to.have.lengthOf(2);
  });
});
