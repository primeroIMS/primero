// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../../permissions";

import ProtectionConcern from "./component";

describe("<ProtectionConcern> - pages/dashboard/components/protection-concern", () => {
  const permissions = {
    dashboards: [ACTIONS.DASH_PROTECTION_CONCERNS]
  };

  const state = fromJS({
    records: {
      dashboard: {
        protection_concerns: {
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
      }
    },
    user: {
      permissions
    }
  });

  beforeEach(() => {
    mountedComponent(<ProtectionConcern />, state);
  });

  it("should render an <OptionsBoxOptionsBox /> component", () => {
    expect(screen.getByTestId("option-box")).toBeInTheDocument();
  });

  it("should render a <DasboardTable /> component", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  describe("when the data is loading", () => {
    it("renders a <LoadingIndicator />", () => {
      mountedComponent(<ProtectionConcern />, {
        records: {
          dashboard: { protection_concerns: { loading: true, data: [], errors: false } }
        },
        user: {
          permissions
        }
      });

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
