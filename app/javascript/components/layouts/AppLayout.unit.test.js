import { expect } from "chai";
import "test/test.setup";
import { Map } from "immutable";
import { Nav } from "components/nav";
import { setupMountedComponent } from "test";
import { routes } from "config";
import AppLayout from "./AppLayout";

describe("<AppLayout />", () => {
  let component;

  before(() => {
    const state = Map({
      ui: Map({
        Nav: Map({
          drawerOpen: true
        })
      }),
      user: Map({
        module: "primero",
        agency: "unicef",
        isAuthenticated: true,
        messages: null
      })
    });
    component = setupMountedComponent(AppLayout, { route: routes[1] }, state)
      .component;
  });

  it("renders navigation", () => {
    expect(component.find(Nav)).to.have.length(1);
  });

  // TODO: Need to figure out how to better test
  it("navigates to incidents list", () => {
    component.find('a[href="/incidents"]').simulate("click", { button: 0 });
    expect(component.find('a[href="/incidents"]').hasClass('active')).to.equal(true);
  });
});
