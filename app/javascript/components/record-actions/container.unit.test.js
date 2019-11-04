import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Menu, MenuItem } from "@material-ui/core";
import { fromJS } from "immutable";

import { PERMISSION_CONSTANTS } from "./../../libs/permissions";

import RecordActions from "./container";
import { Notes } from "./notes";
import { ToggleEnable } from "./toggle-enable";
import { Transitions } from "./transitions";
import { ToggleOpen } from "./toggle-open";

describe("<RecordActions />", () => {
  let component;
  const defaultState = fromJS({
    user: {
      permissions: {
        cases: [PERMISSION_CONSTANTS.MANAGE]
      }
    }
  });
  const props = {
    recordType: "cases",
    mode: { isShow: true },
    record: fromJS({ status: "open" })
  };

  describe("Component ToggleOpen", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });

    it("renders ToggleOpen", () => {
      expect(component.find(ToggleOpen)).to.have.length(1);
    });
  });

  describe("Component ToggleEnable", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });

    it("renders ToggleEnable", () => {
      expect(component.find(ToggleEnable)).to.have.length(1);
    });
  });

  describe("Component Transitions", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });
    it("renders Transitions", () => {
      expect(component.find(Transitions)).to.have.length(1);
    });
  });

  describe("Component Notes", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });

    it("renders Notes", () => {
      expect(component.find(Notes)).to.have.length(1);
    });
  });

  describe("Component Menu", () => {
    describe("when user has access to all menus", () => {
      beforeEach(() => {
        ({ component } = setupMountedComponent(
          RecordActions,
          props,
          fromJS({
            user: {
              permissions: {
                cases: ["manage"]
              }
            }
          })
        ));
      });
      it("renders Menu", () => {
        expect(component.find(Menu)).to.have.length(1);
      });

      it("renders MenuItem", () => {
        expect(component.find(MenuItem)).to.have.length(12);
      });

      it("renders MenuItem with Refer Cases option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("buttons.referral cases")
        ).to.be.equal(true);
      });
    });

    describe("when user has not access to all menus", () => {
      beforeEach(() => {
        ({ component } = setupMountedComponent(
          RecordActions,
          props,
          fromJS({
            user: {
              permissions: {
                cases: ["read"]
              }
            }
          })
        ));
      });

      it("renders Menu", () => {
        expect(component.find(Menu)).to.have.length(1);
      });

      it("renders MenuItem", () => {
        expect(component.find(MenuItem)).to.have.length(7);
      });

      it("renders MenuItem without Refer Cases option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("buttons.referral cases")
        ).to.be.equal(false);
      });
    });
  });
});
