// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../../permissions";
import { PrimeroModuleRecord } from "../../../../application/records";

import WorkflowTeamCases from "./component";

describe("<WorkflowTeamCases> - pages/dashboard/components/workflow-team-cases", () => {
  const permissions = {
    dashboards: [ACTIONS.DASH_WORKFLOW_TEAM]
  };

  const userData = {
    user: {
      permissions,
      modules: ["primeromodule-cp"]
    },
    application: {
      modules: [
        PrimeroModuleRecord({
          unique_id: "primeromodule-cp",
          name: "CP",
          workflows: {
            case: [
              { id: "new", display_text: { en: "New" } },
              { id: "case_plan", display_text: { en: "Case plan" } },
              {
                id: "response_type1",
                display_text: { en: "Response Type 1" }
              }
            ]
          }
        })
      ]
    }
  };

  const workflowTeamData = {
    workflow_team: {
      data: [
        {
          name: "dashboard.workflow_team",
          type: "indicator",
          indicators: {
            "workflow_team_primeromodule-cp": {
              primero_cp: {
                new: {
                  count: 5,
                  query: ["record_state=true", "workflow=new"]
                },
                case_plan: {
                  count: 2,
                  query: ["record_state=true", "workflow=case_plan"]
                },
                response_type1: {
                  count: 0,
                  query: ["record_state=true", "workflow=response_type1"]
                }
              },
              primero_mgr_cp: {
                new: {
                  count: 0,
                  query: ["record_state=true", "workflow=new"]
                },
                case_plan: {
                  count: 1,
                  query: ["record_state=true", "workflow=case_plan"]
                },
                response_type1: {
                  count: 4,
                  query: ["record_state=true", "workflow=response_type1"]
                }
              },
              "": {
                new: {
                  count: 0,
                  query: ["record_state=true", "workflow=new"]
                },
                case_plan: {
                  count: 0,
                  query: ["record_state=true", "workflow=case_plan"]
                },
                response_type1: {
                  count: 0,
                  query: ["record_state=true", "workflow=response_type1"]
                }
              }
            }
          }
        }
      ]
    }
  };

  describe("when component has data", () => {
    const state = fromJS({
      records: {
        dashboard: { ...workflowTeamData }
      },
      ...userData
    });

    beforeEach(() => {
      mountedComponent(<WorkflowTeamCases />, state);
    });

    it("should render a <DashboardTable /> component", () => {
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("should render 4 columns", () => {
      expect(document.querySelectorAll("th")).toHaveLength(4);
    });

    it("should render New column", () => {
      expect(screen.getAllByText("New")).toBeTruthy();
    });

    it("should render Case plan column", () => {
      expect(screen.getAllByText("Case plan")).toBeTruthy();
    });

    it("should render Response Type 1 column", () => {
      expect(screen.getAllByText("Response Type 1")).toBeTruthy();
    });
  });

  describe("when the data is loading", () => {
    it("renders a <LoadingIndicator />", () => {
      mountedComponent(<WorkflowTeamCases />, {
        records: { dashboard: { workflow_team: { loading: true, data: [], errors: false } } },
        ...userData
      });

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("when a modules does not define workflow labels", () => {
    it("does not render the <DashboardTable />", () => {
      const state = fromJS({
        user: {
          permissions,
          modules: ["primeromodule-cp"]
        },
        application: {
          modules: [
            PrimeroModuleRecord({
              unique_id: "primeromodule-cp",
              name: "CP",
              workflows: {}
            })
          ]
        },
        records: {
          dashboard: {
            ...workflowTeamData
          }
        }
      });

      mountedComponent(<WorkflowTeamCases />, state);
      expect(screen.queryByRole("grid")).toBeNull();
    });
  });

  describe("when there is no data for the module", () => {
    it("it renders the <DashboardTable /> with no records found message", () => {
      const state = fromJS({
        user: {
          permissions,
          modules: ["primeromodule-cp"]
        },
        application: {
          modules: [
            PrimeroModuleRecord({
              unique_id: "primeromodule-cp",
              name: "CP",
              workflows: {
                case: [
                  { id: "new", display_text: { en: "New" } },
                  { id: "case_plan", display_text: { en: "Case plan" } },
                  {
                    id: "response_type1",
                    display_text: { en: "Response Type 1" }
                  }
                ]
              }
            })
          ]
        },
        records: {
          dashboard: {
            workflow_team: {
              data: [
                {
                  name: "dashboard.workflow_team",
                  type: "indicator",
                  indicators: {}
                }
              ]
            }
          }
        }
      });

      mountedComponent(<WorkflowTeamCases />, state);
      expect(screen.getByRole("grid")).toBeInTheDocument();
      expect(screen.getByText("Sorry, no matching records found")).toBeInTheDocument();
    });
  });

  describe("when a user has multple modules", () => {
    it("it renders a <DashboardTable /> for each module", () => {
      const state = fromJS({
        user: {
          permissions,
          modules: ["primeromodule-module1", "primeromodule-module2"]
        },
        application: {
          modules: [
            PrimeroModuleRecord({
              unique_id: "primeromodule-module1",
              name: "Module1",
              workflows: {
                case: [
                  { id: "new", display_text: { en: "New" } },
                  { id: "case_plan", display_text: { en: "Case plan" } }
                ]
              }
            }),
            PrimeroModuleRecord({
              unique_id: "primeromodule-module2",
              name: "Module 1",
              workflows: {
                case: [
                  { id: "new", display_text: { en: "New" } },
                  { id: "closed", display_text: { en: "Closed" } }
                ]
              }
            })
          ]
        },
        records: {
          dashboard: {
            workflow_team: {
              data: [
                {
                  name: "dashboard.workflow_team",
                  type: "indicator",
                  indicators: {
                    "workflow_team_primeromodule-cp": {
                      primero_cp: {
                        new: {
                          count: 5,
                          query: ["record_state=true", "workflow=new"]
                        },
                        case_plan: {
                          count: 2,
                          query: ["record_state=true", "workflow=case_plan"]
                        }
                      }
                    },
                    "workflow_team_primeromodule-module1": {
                      primero_gbv: {
                        new: {
                          count: 2,
                          query: ["record_state=true", "workflow=new"]
                        },
                        closed: {
                          count: 1,
                          query: ["record_state=true", "workflow=closed"]
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      });

      mountedComponent(<WorkflowTeamCases />, state);
      expect(screen.queryAllByRole("grid")).toHaveLength(2);
    });
  });
});
