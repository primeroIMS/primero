import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";
import { PageHeading } from "../../page";
import { MANAGE } from "../../../libs/permissions";

import Admin from "./container";
import AdminNav from "./admin-nav";
import AdminNavItem from "./admin-nav-item";

describe("<Admin />", () => {
  let component;
  const initialState = fromJS({});

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      Admin,
      {
        routes: []
      },
      initialState
    ));
  });

  it("renders the admin container", () => {
    expect(component.find(Admin)).to.have.lengthOf(1);
    expect(component.find(PageHeading).text()).to.equal("settings.title");
  });

  describe("when user doesn't have access to metadata", () => {
    const initialStateNoMetadata = fromJS({
      user: {
        isAuthenticated: true,
        id: 4,
        username: "primero_mgr_cp",
        modules: ["primeromodule-cp"],
        permissions: {
          users: MANAGE,
          agencies: MANAGE,
          roles: MANAGE
        }
      }
    });

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Admin,
        {
          routes: []
        },
        initialStateNoMetadata
      ));
    });

    it("renders only the permitted items", () => {
      expect(component.find(Admin)).to.have.lengthOf(1);
      expect(component.find(AdminNav)).to.have.lengthOf(1);
      // 4 of this AdminNavItem are the items not implemented yet
      expect(component.find(AdminNavItem)).to.have.lengthOf(7);
    });
  });
});
