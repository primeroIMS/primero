import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../test";
import { ACTIONS } from "../../../../../libs/permissions";
import { FlagBox, OptionsBox } from "../../../../dashboard";
import LoadingIndicator from "../../../../loading-indicator";
import ActionButton from "../../../../action-button";

import Flags from "./component";

describe("<Flags> - pages/dashboard/components/flags", () => {
  let component;
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
          ]
        }
      }
    },
    user: {
      permissions
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(Flags, {}, state));
  });

  it("should render an <OptionsBox /> component", () => {
    expect(component.find(OptionsBox)).to.have.lengthOf(1);
  });

  it("should render a <FlagBox /> component", () => {
    expect(component.find(FlagBox)).to.have.lengthOf(1);
  });

  it("should render a <ActionButton /> component", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(1);
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
      const { component: loadingComponent } = setupMountedComponent(Flags, props, {
        records: {
          dashboard: {
            flags: { data: [], loading: true }
          }
        },
        user: {
          permissions
        }
      });

      expect(loadingComponent.find(LoadingIndicator)).to.have.lengthOf(1);
    });
  });
});
