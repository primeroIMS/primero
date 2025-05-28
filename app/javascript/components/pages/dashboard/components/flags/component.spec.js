// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../../permissions";

import Flags from "./component";

describe("<Flags> - pages/dashboard/components/flags", () => {
  const permissions = {
    cases: [ACTIONS.MANAGE],
    dashboards: [ACTIONS.DASH_FLAGS]
  };

  const state = fromJS({
    records: {
      dashboard: {
        flags: {
          data: [
            {
              hidden_name: false,
              removed: false,
              message: "Reason 1",
              owned_by_agency_id: "TEST",
              record_type: "cases",
              record_access_denied: false,
              record_id: "41a3e69b-991a-406e-b0ee-9123cb60c983",
              created_at: "2020-12-02T16:18:40.307Z",
              name: "User 1",
              unflagged_date: null,
              system_generated_followup: false,
              unflag_message: null,
              date: "2020-12-10",
              owned_by: "primero_test",
              unflagged_by: null,
              id: 1,
              flagged_by: "primero_test",
              short_id: "33e620e"
            }
          ],
          metadata: {
            total: 1,
            per: 10,
            page: 1
          }
        }
      }
    },
    user: {
      permissions
    }
  });

  beforeEach(() => {
    mountedComponent(<Flags />, state);
  });

  it("should render an <OptionsBox /> component", () => {
    expect(screen.getByTestId("option-box")).toBeInTheDocument();
  });

  it("should render a <FlagBox /> component", () => {
    expect(screen.getByText("dashboard.flagged_cases")).toBeInTheDocument();
  });

  it("should render a <ActionButton /> component", () => {
    expect(screen.getByText("dashboard.link_see_all (1)")).toBeInTheDocument();
  });

  describe("when the data is loading", () => {
    const props = {
      loadingIndicator: {
        overlay: true,
        type: "NAMESPACE",
        loading: true,
        errors: false,
        classes: {}
      }
    };

    it("renders a <LoadingIndicator />", () => {
      mountedComponent(<Flags {...props} />, {
        records: {
          dashboard: {
            flags: { data: [], loading: true }
          }
        },
        user: {
          permissions
        }
      });

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
