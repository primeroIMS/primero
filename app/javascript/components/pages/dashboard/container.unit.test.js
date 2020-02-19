import { expect } from "chai";
import { fromJS, Map, List } from "immutable";
import {
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  CircularProgress
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";

import { setupMountedComponent } from "../../../test";
import { OverviewBox } from "../../dashboard/overview-box";
import { FlagBox } from "../../dashboard/flag-box";
import { FlagList } from "../../dashboard/flag-list";
import { DoughnutChart } from "../../dashboard/doughnut-chart";
import { LineChart } from "../../dashboard/line-chart";
import { DashboardTable } from "../../dashboard/dashboard-table";
import { BadgedIndicator } from "../../dashboard/badged-indicator";
import { PieChart } from "../../dashboard/pie-chart";
import { ACTIONS, DASH_APPROVALS_PENDING } from "../../../libs/permissions";
import { LoadingIndicator } from "../../loading-indicator";

import Dashboard from "./container";

describe("<Dashboard />", () => {
  let component;

  const emptyRecords = {
    records: {
      dashboard: {
        loading: true
      }
    }
  };

  before(() => {
    ({ component } = setupMountedComponent(
      Dashboard,
      {},
      fromJS({
        application: {
          reportingLocationConfig: {
            label_key: "district",
            admin_level: 2,
            field_key: "owned_by_location"
          }
        },
        forms: {
          options: {
            locations: [
              {
                id: 1,
                code: "1506060",
                type: "sub_district",
                name: { en: "My District" }
              }
            ]
          }
        },
        records: {
          dashboard: {
            data: [
              {
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
              }
            ],
            flags: {
              flags: [
                {
                  id: "#1234",
                  flag_date: "01/01/2019",
                  user: "CP Admin",
                  status: "Please check approval"
                },
                {
                  id: "#1235",
                  flag_date: "01/01/2019",
                  user: "CP Manager",
                  status: "To followup"
                }
              ],
              totalCount: 0
            },
            casesByStatus: {
              open: "2660451",
              closed: "1547"
            },
            casesRegistration: {
              jan: 100,
              feb: 100
            },
            casesByCaseWorker: [
              {
                case_worker: "Case Worker 1",
                assessment: "2",
                case_plan: "1",
                follow_up: "0",
                services: "1"
              }
            ],
            casesOverview: {
              transfers: 4,
              waiting: 1,
              pending: 1,
              rejected: 1
            }
          }
        },
        user: {
          permissions: {
            dashboards: [
              ACTIONS.DASH_CASE_RISK,
              ACTIONS.DASH_WORKFLOW,
              ACTIONS.DASH_WORKFLOW_TEAM,
              ACTIONS.DASH_REPORTING_LOCATION,
              ACTIONS.DASH_APPROVALS_CLOSURE
            ]
          }
        }
      })
    ));
  });

  it("renders the OverviewBox", () => {
    expect(component.find(OverviewBox)).to.have.lengthOf(1);
  });

  // it("renders the FlagList", () => {
  //   expect(component.find(FlagList)).to.have.lengthOf(1);
  // });

  // it("renders the FlagBox", () => {
  //   expect(component.find(FlagList).find(FlagBox)).to.have.lengthOf(2);
  // });

  // it("renders the Doughnut chart", () => {
  //   expect(component.find(DoughnutChart)).to.have.lengthOf(1);
  // });

  // it("renders the Line chart", () => {
  //   expect(component.find(LineChart)).to.have.lengthOf(1);
  // });

  // The lengthOf value has to be increased when the DashboardTable will be reused
  it("renders the DashboardTable", () => {
    expect(component.find(DashboardTable)).to.have.lengthOf(2);
  });

  // The lengthOf value has to be increased when the DashboardTable(it call TableBody component ) will be reused
  it("renders only one TableRow in the TableBody", () => {
    expect(component.find(TableBody).find(TableRow)).to.have.lengthOf(2);
  });

  it("renders the BadgedIndicator", () => {
    expect(component.find(BadgedIndicator)).to.have.lengthOf(1);
  });

  it("renders the PieChart", () => {
    expect(component.find(PieChart)).to.have.lengthOf(1);
  });

  it("renders the Reporting Location Table", () => {
    expect(
      component
        .find({ title: "cases.label" })
        .find(DashboardTable)
        .find(TableBody)
        .find(TableRow)
    ).to.have.lengthOf(1);
  });

  describe("render approvals dashboards assessment", () => {
    const userPermissions = {
      user: {
        permissions: {
          dashboards: [ACTIONS.DASH_APPROVALS_ASSESSMENT]
        }
      }
    };

    const initialState = fromJS({
      records: {
        dashboard: {
          data: [
            {
              name: "dashboard.approvals_assessment",
              type: "indicator",
              indicators: {
                approval_assessment_pending: {
                  count: 1,
                  query: []
                }
              }
            }
          ]
        }
      },
      ...userPermissions
    });

    beforeEach(() => {
      ({ component } = setupMountedComponent(Dashboard, {}, initialState));
    });

    it("renders the OverviewBox", () => {
      expect(component.find(OverviewBox)).to.have.lengthOf(1);
      expect(component.find("li")).to.have.lengthOf(1);
      expect(component.find("button")).to.have.lengthOf(1);
    });

    describe("when the data is loading", () => {
      const initialStateDataLoading = fromJS({
        ...emptyRecords,
        ...userPermissions
      });

      beforeEach(() => {
        ({ component } = setupMountedComponent(
          Dashboard,
          {},
          initialStateDataLoading
        ));
      });

      it("renders the OverviewBox with Loading Indicator", () => {
        expect(component.find(OverviewBox)).to.have.lengthOf(1);
        expect(component.find(LoadingIndicator)).to.have.lengthOf(1);
        expect(component.find(CircularProgress)).to.have.lengthOf(1);
      });
    });
  });

  describe("render approvals dashboards case plan", () => {
    const userPermissions = {
      user: {
        permissions: {
          dashboards: [ACTIONS.DASH_APPROVALS_CASE_PLAN]
        }
      }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
              data: [
                {
                  name: "dashboard.approvals_case_plan",
                  type: "indicator",
                  indicators: {
                    approval_case_plan_pending: {
                      count: 1,
                      query: []
                    }
                  }
                }
              ]
            }
          },
          ...userPermissions
        })
      ));
    });

    it("renders the OverviewBox", () => {
      expect(component.find(OverviewBox)).to.have.lengthOf(1);
      expect(component.find("li")).to.have.lengthOf(1);
      expect(component.find("button")).to.have.lengthOf(1);
    });

    describe("when the data is loading", () => {
      const initialStateDataLoading = fromJS({
        ...emptyRecords,
        ...userPermissions
      });

      beforeEach(() => {
        ({ component } = setupMountedComponent(
          Dashboard,
          {},
          initialStateDataLoading
        ));
      });

      it("renders the OverviewBox with Loading Indicator", () => {
        expect(component.find(OverviewBox)).to.have.lengthOf(1);
        expect(component.find(LoadingIndicator)).to.have.lengthOf(1);
        expect(component.find(CircularProgress)).to.have.lengthOf(1);
      });
    });
  });

  describe("render approvals dashboards closure", () => {
    const userPermissions = {
      user: {
        permissions: {
          dashboards: [ACTIONS.DASH_APPROVALS_CLOSURE]
        }
      }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
              data: [
                {
                  name: "dashboard.approvals_closure",
                  type: "indicator",
                  indicators: {
                    approval_closure_pending: {
                      count: 1,
                      query: []
                    }
                  }
                }
              ]
            }
          },
          ...userPermissions
        })
      ));
    });

    it("renders the OverviewBox", () => {
      expect(component.find(OverviewBox)).to.have.lengthOf(1);
      expect(component.find("li")).to.have.lengthOf(1);
      expect(component.find("button")).to.have.lengthOf(1);
    });

    describe("when the data is loading", () => {
      const initialStateDataLoading = fromJS({
        ...emptyRecords,
        ...userPermissions
      });

      beforeEach(() => {
        ({ component } = setupMountedComponent(
          Dashboard,
          {},
          initialStateDataLoading
        ));
      });

      it("renders the OverviewBox with Loading Indicator", () => {
        expect(component.find(OverviewBox)).to.have.lengthOf(1);
        expect(component.find(LoadingIndicator)).to.have.lengthOf(1);
        expect(component.find(CircularProgress)).to.have.lengthOf(1);
      });
    });
  });

  describe("render pending approvals dashboards", () => {
    const userPermissions = {
      user: {
        permissions: {
          dashboards: [DASH_APPROVALS_PENDING]
        }
      }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
              data: [
                {
                  name: "dashboard.approvals_assessment_pending",
                  type: "indicator",
                  indicators: {
                    approval_assessment_pending_group: {
                      count: 1,
                      query: []
                    }
                  }
                },
                {
                  name: "dashboard.approvals_case_plan_pending",
                  type: "indicator",
                  indicators: {
                    approval_case_plan_pending_group: {
                      count: 2,
                      query: []
                    }
                  }
                },
                {
                  name: "dashboard.approvals_closure_pending",
                  type: "indicator",
                  indicators: {
                    approval_closure_pending_group: {
                      count: 3,
                      query: []
                    }
                  }
                }
              ]
            }
          },
          ...userPermissions
        })
      ));
    });

    it("renders the OverviewBox", () => {
      expect(component.find(OverviewBox)).to.have.lengthOf(1);
      expect(component.find("li")).to.have.lengthOf(3);
      expect(component.find("button")).to.have.lengthOf(3);
      expect(
        component
          .find(OverviewBox)
          .find("div div")
          .text()
      ).to.be.equal("dashboard.pending_approvals");
    });

    describe("when the data is loading", () => {
      const initialStateDataLoading = fromJS({
        ...emptyRecords,
        ...userPermissions
      });

      beforeEach(() => {
        ({ component } = setupMountedComponent(
          Dashboard,
          {},
          initialStateDataLoading
        ));
      });

      it("renders the OverviewBox with Loading Indicator", () => {
        expect(component.find(OverviewBox)).to.have.lengthOf(1);
        expect(component.find(LoadingIndicator)).to.have.lengthOf(1);
        expect(component.find(CircularProgress)).to.have.lengthOf(1);
      });
    });
  });

  describe("render protection concerns dashboards", () => {
    const userPermissions = {
      user: {
        permissions: {
          dashboards: [ACTIONS.DASH_PROTECTION_CONCERNS]
        }
      }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
              data: [
                {
                  name: "dashboard.dash_protection_concerns",
                  type: "indicator",
                  indicators: {
                    protection_concerns_open_cases: {
                      statelessness: {
                        count: 2,
                        query: []
                      }
                    },
                    protection_concerns_new_this_week: {
                      statelessness: {
                        count: 1,
                        query: []
                      }
                    },
                    protection_concerns_all_cases: {
                      statelessness: {
                        count: 4,
                        query: []
                      }
                    },
                    protection_concerns_closed_this_week: {
                      statelessness: {
                        count: 1,
                        query: []
                      }
                    }
                  }
                }
              ]
            }
          },
          ...userPermissions
        })
      ));
    });

    it("renders the DashboardTable", () => {
      expect(component.find(DashboardTable)).to.have.lengthOf(1);
      expect(component.find(MUIDataTable)).to.have.lengthOf(1);
      expect(component.find(TableBody)).to.have.lengthOf(1);
      expect(component.find(TableBody).find(TableRow)).to.have.lengthOf(1);
    });

    describe("when the data is loading", () => {
      const initialStateDataLoading = fromJS({
        ...emptyRecords,
        ...userPermissions
      });

      beforeEach(() => {
        ({ component } = setupMountedComponent(
          Dashboard,
          {},
          initialStateDataLoading
        ));
      });

      it("renders the DashboardTable with Loading Indicator", () => {
        expect(component.find(LoadingIndicator)).to.have.lengthOf(1);
        expect(component.find(CircularProgress)).to.have.lengthOf(1);
      });
    });
  });

  describe("render overdue task assesment dashboard", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
              data: [
                {
                  name: "dashboard.cases_by_task_overdue_assessment",
                  type: "indicator",
                  indicators: {
                    tasks_overdue_assessment: {
                      primero: {
                        count: 0,
                        query: ["record_state=true"]
                      }
                    }
                  }
                }
              ]
            }
          },
          user: {
            permissions: {
              dashboards: [ACTIONS.DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT]
            }
          }
        })
      ));
    });

    it("renders the DashboardTable", () => {
      expect(component.find(DashboardTable)).to.have.lengthOf(1);
    });

    it("renders only the columns case worker and assessment", () => {
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
      ).to.have.lengthOf(2);
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
          .first()
          .text()
      ).to.equal("dashboard.case_worker");
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
          .last()
          .text()
      ).to.equal("dashboard.assessment");
    });
  });

  describe("render overdue task case plan dashboard", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
              data: [
                {
                  name: "dashboard.cases_by_task_overdue_case_plan",
                  type: "indicator",
                  indicators: {
                    tasks_overdue_case_plan: {
                      primero: {
                        count: 0,
                        query: ["record_state=true"]
                      }
                    }
                  }
                }
              ]
            }
          },
          user: {
            permissions: {
              dashboards: [ACTIONS.DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN]
            }
          }
        })
      ));
    });

    it("renders the DashboardTable", () => {
      expect(component.find(DashboardTable)).to.have.lengthOf(1);
    });

    it("renders only the columns case worker and case plan", () => {
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
      ).to.have.lengthOf(2);
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
          .first()
          .text()
      ).to.equal("dashboard.case_worker");
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
          .last()
          .text()
      ).to.equal("dashboard.case_plan");
    });
  });

  describe("render overdue task services dashboard", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
              data: [
                {
                  name: "dashboard.cases_by_task_overdue_services",
                  type: "indicator",
                  indicators: {
                    tasks_overdue_services: {
                      primero: {
                        count: 0,
                        query: ["record_state=true"]
                      }
                    }
                  }
                }
              ]
            }
          },
          user: {
            permissions: {
              dashboards: [ACTIONS.DASH_CASES_BY_TASK_OVERDUE_SERVICES]
            }
          }
        })
      ));
    });

    it("renders the DashboardTable", () => {
      expect(component.find(DashboardTable)).to.have.lengthOf(1);
    });

    it("renders only the columns case worker and case plan", () => {
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
      ).to.have.lengthOf(2);
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
          .first()
          .text()
      ).to.equal("dashboard.case_worker");
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
          .last()
          .text()
      ).to.equal("dashboard.services");
    });
  });

  describe("render overdue task followups dashboard", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
              data: [
                {
                  name: "dashboard.cases_by_task_overdue_followups",
                  type: "indicator",
                  indicators: {
                    tasks_overdue_followups: {
                      primero: {
                        count: 0,
                        query: ["record_state=true"]
                      }
                    }
                  }
                }
              ]
            }
          },
          user: {
            permissions: {
              dashboards: [ACTIONS.DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS]
            }
          }
        })
      ));
    });

    it("renders the DashboardTable", () => {
      expect(component.find(DashboardTable)).to.have.lengthOf(1);
    });

    it("renders only the columns case worker and case plan", () => {
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
      ).to.have.lengthOf(2);
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
          .first()
          .text()
      ).to.equal("dashboard.case_worker");
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
          .last()
          .text()
      ).to.equal("dashboard.follow_up");
    });
  });

  describe("render all overdue tasks", () => {
    const userPermissions = {
      user: {
        permissions: {
          dashboards: [ACTIONS.DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS]
        }
      }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
              data: [
                {
                  name: "dashboard.cases_by_task_overdue_assessment",
                  type: "indicator",
                  indicators: {
                    tasks_overdue_assessment: {
                      primero: {
                        count: 0,
                        query: ["record_state=true"]
                      }
                    }
                  }
                },
                {
                  name: "dashboard.cases_by_task_overdue_case_plan",
                  type: "indicator",
                  indicators: {
                    tasks_overdue_case_plan: {
                      primero: {
                        count: 0,
                        query: ["record_state=true"]
                      }
                    }
                  }
                },
                {
                  name: "dashboard.cases_by_task_overdue_services",
                  type: "indicator",
                  indicators: {
                    tasks_overdue_services: {
                      primero: {
                        count: 0,
                        query: ["record_state=true"]
                      }
                    }
                  }
                },
                {
                  name: "dashboard.cases_by_task_overdue_followups",
                  type: "indicator",
                  indicators: {
                    tasks_overdue_followups: {
                      primero: {
                        count: 0,
                        query: ["record_state=true"]
                      }
                    }
                  }
                }
              ]
            }
          },
          ...userPermissions
        })
      ));
    });

    it("renders the DashboardTable", () => {
      expect(component.find(DashboardTable)).to.have.lengthOf(1);
    });

    it("renders all the columns of the task overdues dashboards", () => {
      expect(
        component
          .find(DashboardTable)
          .find(TableHead)
          .find(TableCell)
      ).to.have.lengthOf(5);
    });

    describe("when the data is loading", () => {
      const initialStateDataLoading = fromJS({
        ...emptyRecords,
        ...userPermissions
      });

      beforeEach(() => {
        ({ component } = setupMountedComponent(
          Dashboard,
          {},
          initialStateDataLoading
        ));
      });

      it("renders the DashboardTable with Loading Indicator", () => {
        expect(component.find(LoadingIndicator)).to.have.lengthOf(1);
        expect(component.find(CircularProgress)).to.have.lengthOf(1);
      });
    });
  });

  describe("render shared with me dashboard", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
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
                      query: [
                        "record_state=true",
                        "status=open",
                        "not_edited_by_owner=true"
                      ]
                    },
                    shared_with_me_transfers_awaiting_acceptance: {
                      count: 0,
                      query: ["record_state=true", "status=open"]
                    }
                  }
                }
              ]
            }
          },
          user: {
            permissions: {
              dashboards: [ACTIONS.DASH_SHARED_WITH_ME],
              cases: [ACTIONS.RECEIVE_REFERRAL, ACTIONS.RECEIVE_TRANSFER]
            }
          }
        })
      ));
    });

    it("renders the SharedWithMe Dashboard", () => {
      expect(component.find(OverviewBox)).to.have.lengthOf(1);
      expect(
        component
          .find(OverviewBox)
          .find("div div")
          .text()
      ).to.be.equal("dashboard.dash_shared_with_me");
      expect(component.find(OverviewBox).find("ul li")).to.have.lengthOf(3);
    });
  });

  describe("render shared with others dashboard", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
              data: [
                {
                  name: "dashboard.dash_shared_with_others",
                  type: "indicator",
                  indicators: {
                    shared_with_others_referrals: {
                      count: 0,
                      query: [
                        "owned_by=primero_cp",
                        "record_state=true",
                        "status=open",
                        "referred_users_present=true"
                      ]
                    },
                    shared_with_others_pending_transfers: {
                      count: 0,
                      query: [
                        "owned_by=primero_cp",
                        "record_state=true",
                        "status=open",
                        "transfer_status=in_progress"
                      ]
                    },
                    shared_with_others_rejected_transfers: {
                      count: 0,
                      query: [
                        "owned_by=primero_cp",
                        "record_state=true",
                        "status=open",
                        "transfer_status=rejected"
                      ]
                    }
                  }
                }
              ]
            }
          },
          user: {
            permissions: {
              dashboards: [ACTIONS.DASH_SHARED_WITH_OTHERS]
            }
          }
        })
      ));
    });

    it("renders the SharedWithMe Dashboard", () => {
      expect(component.find(OverviewBox)).to.have.lengthOf(1);
      expect(
        component
          .find(OverviewBox)
          .find("div div")
          .text()
      ).to.be.equal("dashboard.dash_shared_with_others");
      expect(component.find(OverviewBox).find("ul li")).to.have.lengthOf(3);
    });
  });

  describe("render my group's cases", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
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
                }
              ]
            }
          },
          user: {
            permissions: {
              dashboards: [ACTIONS.DASH_GROUP_OVERVIEW]
            }
          }
        })
      ));
    });

    it("renders the My Group's Cases Dashboard", () => {
      expect(component.find(OverviewBox)).to.have.lengthOf(1);
      expect(
        component
          .find(OverviewBox)
          .find("div div")
          .text()
      ).to.be.equal("dashboard.dash_group_overview");
      expect(component.find(OverviewBox).find("ul li")).to.have.lengthOf(2);
    });
  });

  describe("render my cases dashboard", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Dashboard,
        {},
        fromJS({
          records: {
            dashboard: {
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
          },
          user: {
            permissions: {
              dashboards: [ACTIONS.DASH_CASE_OVERVIEW]
            }
          }
        })
      ));
    });

    it("renders the My Cases Dashboard", () => {
      expect(component.find(OverviewBox)).to.have.lengthOf(1);
      expect(
        component
          .find(OverviewBox)
          .find("div div")
          .text()
      ).to.be.equal("dashboard.case_overview");
      expect(component.find(OverviewBox).find("ul li")).to.have.lengthOf(2);
    });
  });
});
