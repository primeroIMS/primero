import { fromJS } from "immutable";
import { Router } from "react-router";

import { ACCEPTED, REJECTED } from "../../config";
import { ACTIONS } from "../permissions";
import { lookups, setupMountedComponent, stub } from "../../test";

import ActivityLog from "./component";

describe("<ActivityLog", () => {
  let stubI18n = null;
  let component;

  beforeEach(() => {
    stubI18n = stub(window.I18n, "t").withArgs("messages.record_list.of").returns("of");
    const initialState = fromJS({
      records: {
        activity_logs: {
          data: [
            {
              type: "transfer",
              record_type: "Child",
              record_id: "0001",
              display_id: "01",
              record_access_denied: false,
              data: {
                status: { to: ACCEPTED },
                owned_by: { from: "user_a", to: "user_b" }
              }
            },
            {
              type: "transfer",
              record_type: "Child",
              record_id: "0002",
              display_id: "02",
              record_access_denied: true,
              data: {
                status: { to: REJECTED },
                owned_by: { from: "user_a", to: "user_b" }
              }
            }
          ],
          metadata: { total: 2 },
          loading: false,
          errors: false
        }
      },
      forms: {
        options: {
          lookups: lookups()
        }
      },
      user: {
        permissions: {
          activity_log: [ACTIONS.MANAGE]
        }
      }
    });

    ({ component } = setupMountedComponent(ActivityLog, {}, initialState));
  });

  describe("when record access is not denied", () => {
    it("redirects to the clicked record", () => {
      component.find("tr td").first().simulate("click");

      expect(component.find(Router).props().history.location.pathname).to.equal("/cases/0001");
    });
  });

  describe("when record access is denied", () => {
    it("does not redirect to the clicked record", () => {
      component.find("tr").last().find("td").first().simulate("click");

      expect(component.find(Router).props().history.location.pathname).to.equal("/");
    });
  });

  afterEach(() => {
    if (stubI18n) {
      window.I18n.t.restore();
    }
  });
});
