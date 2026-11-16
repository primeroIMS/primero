import { fromJS, OrderedMap } from "immutable";
import qs from "qs";
import { mountedComponent, screen, userEvent } from "test-utils";

import { ACTIONS } from "../../../../permissions";
import { PrimeroModuleRecord } from "../../../../application/records";
import { FieldRecord } from "../../../../record-form/records";

import Overview from "./component";

describe("<Overview> - pages/dashboard/components/overview", () => {
  const permissions = fromJS({
    dashboards: [
      ACTIONS.DASH_SHARED_WITH_ME,
      ACTIONS.DASH_SHARED_WITH_OTHERS,
      ACTIONS.DASH_GROUP_OVERVIEW,
      ACTIONS.DASH_CASE_OVERVIEW,
      ACTIONS.DASH_CASE_RISK,
      ACTIONS.DASH_CASE_INCIDENT_OVERVIEW
    ],
    cases: [ACTIONS.RECEIVE_REFERRAL, ACTIONS.RECEIVE_TRANSFER]
  });

  describe("when a user has all the permissions", () => {
    const state = fromJS({
      records: {
        dashboard: {
          referral_transfers: {
            data: [
              {
                name: "dashboard.dash_shared_with_me",
                type: "indicator",
                indicators: {
                  shared_with_me_total_referrals: {
                    count: 0,
                    query: ["record_state=true", "status=open"]
                  },
                  shared_with_me_new_referrals: {
                    count: 0,
                    query: ["record_state=true", "status=open", "not_edited_by_owner=true"]
                  },
                  shared_with_me_transfers_awaiting_acceptance: {
                    count: 0,
                    query: ["record_state=true", "status=open"]
                  }
                }
              },
              {
                name: "dashboard.dash_shared_with_others",
                type: "indicator",
                indicators: {
                  shared_with_others_referrals: {
                    count: 0,
                    query: ["owned_by=primero_cp", "record_state=true", "status=open", "referred_users_present=true"]
                  },
                  shared_with_others_pending_transfers: {
                    count: 0,
                    query: ["owned_by=primero_cp", "record_state=true", "status=open", "transfer_status=in_progress"]
                  },
                  shared_with_others_rejected_transfers: {
                    count: 0,
                    query: ["owned_by=primero_cp", "record_state=true", "status=open", "transfer_status=rejected"]
                  }
                }
              }
            ]
          },
          overview: {
            data: [
              {
                name: "dashboard.dash_group_overview",
                type: "indicator",
                indicators: {
                  group_overview_open: {
                    count: 5,
                    query: ["record_state=true", "status=open"]
                  },
                  group_overview_closed: {
                    count: 0,
                    query: ["record_state=true", "status=closed"]
                  }
                }
              },
              {
                name: "dashboard.case_overview",
                type: "indicator",
                indicators: {
                  open: {
                    count: 5,
                    query: ["record_state=true", "status=open"]
                  },
                  closed: {
                    count: 0,
                    query: ["record_state=true", "status=closed"]
                  }
                }
              }
            ]
          }
        }
      },
      user: {
        permissions
      }
    });

    const props = {
      userPermissions: permissions
    };

    beforeEach(() => {
      mountedComponent(<Overview {...props} />, state);
    });

    it("should render a <OptionsBox /> component", () => {
      expect(screen.getAllByTestId("option-box")).toHaveLength(3);
    });

    it("should render a <OverviewBox /> component", () => {
      expect(screen.getAllByTestId("overview-box")).toHaveLength(2);
    });

    it("renders the dash_group_overview dashboard", () => {
      expect(screen.getByText("dashboard.dash_group_overview")).toBeInTheDocument();
    });

    it("renders the dash_case_incident_overview dashboard", () => {
      expect(screen.getByText("dashboard.dash_case_incident_overview")).toBeInTheDocument();
    });

    it("does not render the shared_with_me dashboard", () => {
      expect(screen.queryByText("dashboard.dash_shared_with_me")).toBeNull();
    });

    it("does not render the dash_shared_with_others dashboard", () => {
      expect(screen.queryByText("dashboard.dash_shared_with_others")).toBeNull();
    });

    it("does not render the case_overview dashboard", () => {
      expect(screen.queryByText("dashboard.dash_shared_with_others")).toBeNull();
    });
  });

  describe("when the data is loading", () => {
    it("renders a <LoadingIndicator />", () => {
      mountedComponent(<Overview />, {
        records: { dashboard: { overview: { data: [], loading: true, errors: false } } },
        user: { permissions }
      });

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("when a user has DASH_CASE_OVERVIEW", () => {
    it("renders the case_overview dashboard", () => {
      mountedComponent(<Overview />, {
        records: {
          dashboard: {
            overview: {
              data: [
                {
                  name: "dashboard.case_overview",
                  type: "indicator",
                  indicators: {
                    open: {
                      count: 5,
                      query: ["record_state=true", "status=open"]
                    },
                    closed: {
                      count: 0,
                      query: ["record_state=true", "status=closed"]
                    }
                  }
                }
              ]
            }
          }
        },
        user: {
          permissions: {
            dashboards: [ACTIONS.DASH_CASE_OVERVIEW]
          }
        }
      });

      expect(screen.queryByText("dashboard.case_overview")).toBeInTheDocument();
    });
  });

  describe("when the dash_case_incident_overview label is overridden", () => {
    it("renders the overridden dashboard title", () => {
      mountedComponent(
        <Overview />,
        fromJS({
          records: {
            dashboard: {
              overview: {
                data: [
                  {
                    name: "dashboard.dash_case_incident_overview",
                    type: "indicator",
                    indicators: { open: { count: 5, query: ["record_state=true", "status=open"] } }
                  }
                ]
              }
            }
          },
          application: {
            modules: [
              PrimeroModuleRecord({
                unique_id: "primeromodule-cp",
                name: "CP",
                field_labels: { "dashboard.dash_case_incident_overview": { en: "My Cases / Monitoring Reports" } }
              })
            ]
          },
          user: {
            modules: ["primeromodule-cp"],
            permissions: { dashboards: [ACTIONS.DASH_CASE_INCIDENT_OVERVIEW] }
          }
        })
      );

      expect(screen.getByText("My Cases / Monitoring Reports")).toBeInTheDocument();
    });
  });

  describe("when a user only has DASH_CASES_BY_INCIDENT_TYPE", () => {
    let store;

    beforeEach(() => {
      ({ store } = mountedComponent(<Overview />, {
        records: {
          dashboard: {
            overview: {
              data: [
                {
                  name: "dashboard.dash_cases_by_incident_type",
                  type: "indicator",
                  indicators: {
                    cases_by_incident_type: {
                      physical: {
                        count: 2,
                        query: ["record_state=true", "status=open", "incident_types=physical"]
                      }
                    }
                  }
                }
              ]
            }
          }
        },
        forms: {
          fields: OrderedMap({
            1: FieldRecord({ name: "incident_types", option_strings_source: "lookup lookup-incident-types" })
          }),
          options: {
            lookups: [
              {
                unique_id: "lookup-incident-types",
                values: [
                  { id: "physical", display_text: { en: "Physical violence" } },
                  { id: "neglect", display_text: { en: "Neglect" } }
                ]
              }
            ]
          }
        },
        user: {
          permissions: {
            dashboards: [ACTIONS.DASH_CASES_BY_INCIDENT_TYPE]
          }
        }
      }));
    });

    it("renders the overview card with the cases_by_incident_type dashboard", () => {
      expect(screen.getByText("dashboard.overview")).toBeInTheDocument();
      expect(screen.getByText("dashboard.dash_cases_by_incident_type")).toBeInTheDocument();
    });

    it("renders a row with the count for each incident type option", () => {
      expect(screen.getByText("Physical violence")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("Neglect")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("navigates to the cases list filtered by the incident type", async () => {
      await userEvent.click(screen.getByText("2"));

      const [navigation] = store.getActions().filter(action => action.type === "@@router/CALL_HISTORY_METHOD");

      const { pathname, search } = navigation.payload.args[0];

      expect(pathname).toBe("/cases");
      expect(qs.parse(search)).toEqual({ record_state: ["true"], status: ["open"], incident_types: ["physical"] });
    });

    it("does not navigate when an incident type has no cases", async () => {
      await userEvent.click(screen.getByText("0"));

      expect(store.getActions().filter(action => action.type === "@@router/CALL_HISTORY_METHOD")).toHaveLength(0);
    });
  });
});
