import { fromJS } from "immutable";
import { ListItem, ListItemText } from "@material-ui/core";

import { ConditionalWrapper } from "../../../../libs";
import { setupMountedComponent } from "../../../../test";
import { ACTIONS } from "../../../../libs/permissions";

import MenuEntry from "./component";

describe("<Nav />", () => {
  let component;
  const permissions = {
    cases: [ACTIONS.MANAGE],
    incidents: [ACTIONS.READ],
    dashboards: [ACTIONS.MANAGE, ACTIONS.DASH_TASKS],
    potential_matches: [ACTIONS.MANAGE],
    tracing_requests: [ACTIONS.READ],
    reports: [ACTIONS.MANAGE]
  };
  const state = {
    ui: { Nav: { drawerOpen: true } },
    application: {
      modules: {},
      online: true,
      agencies: [
        {
          unique_id: "agency_1",
          logo: { small: "/some/random.png" }
        }
      ],
      disabledApplication: false
    },
    user: {
      modules: [],
      agency: "agency_1",
      permissions
    }
  };

  const props = {
    closeDrawer: () => {},
    jewelCount: 0,
    menuEntry: {
      to: "/test",
      name: "test",
      icon: "testIcon",
      disableOffline: false,
      disabled: false
    },
    mobileDisplay: false,
    username: "joshua"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(MenuEntry, props, fromJS(state)));
  });

  it("renders a ConditionalWrapper", () => {
    expect(component.find(ConditionalWrapper)).to.have.lengthOf(1);
  });

  it("renders a ListItemText", () => {
    expect(component.find(ListItemText).last().text()).to.be.equal("test");
  });

  it("renders a ListItem", () => {
    const listItem = component.find(ListItem);

    expect(listItem).to.have.lengthOf(1);
    expect(listItem.props()).to.have.any.keys("to", "onClick");
  });

  describe("when application is disabled", () => {
    const stateWithDisabledApp = fromJS({ ...state, application: { ...state.application, disabledApplication: true } });
    const { component: disabledListItem } = setupMountedComponent(MenuEntry, props, stateWithDisabledApp);

    it("renders a disabled ListItem", () => {
      const disabledItem = disabledListItem.find(ListItem);

      expect(disabledItem).to.have.lengthOf(1);
      expect(disabledItem.props()).to.not.have.any.keys("to", "onClick");
    });
  });
});
