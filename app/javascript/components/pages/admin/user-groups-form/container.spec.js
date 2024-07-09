import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { WRITE_RECORDS } from "../../../permissions";

import UserGroupsForm from "./container";

describe("<UserGroupsForm />", () => {
  beforeEach(() => {
    const initialState = fromJS({
      records: {
        user_groups: {
          data: [
            {
              id: 1,
              unique_id: "usergroup-test",
              name: "Test",
              description: "Default Test usergroup",
              core_resource: false
            }
          ],
          metadata: { total: 1, per: 20, page: 1 }
        }
      },
      application: {
        agencies: [{ id: 1, unique_id: "agency-unicef", name: "UNICEF" }]
      },
      user: {
        permissions: {
          user_groups: [WRITE_RECORDS]
        }
      }
    });

    mountedComponent(<UserGroupsForm mode="new" />, initialState, ["/admin/user_groups"]);
  });

  it("renders record form", () => {
    expect(document.querySelector("#user-groups-form")).toBeInTheDocument();
  });

  it("renders heading with action buttons", () => {
    expect(screen.getByText("user_groups.label")).toBeInTheDocument();
    expect(screen.getByText("buttons.cancel")).toBeInTheDocument();
    expect(screen.getByText("buttons.save")).toBeInTheDocument();
  });
});
