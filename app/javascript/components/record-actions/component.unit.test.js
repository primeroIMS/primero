import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map, List } from "immutable";
import { ToggleOpen } from "components/record-actions/toggle-open";
import { ToggleEnable } from "components/record-actions/toggle-enable";
import { Transitions } from "components/record-actions/transitions";
import { Notes } from "components/record-actions/notes";
import { Menu, MenuItem } from "@material-ui/core";
import * as Permissions from "libs/permissions";
import RecordActions from "./component";

describe("<RecordActions />", () => {
  let component;
  const defaultState = Map({
    user: Map({
      permissions: Map({
        cases: List([Permissions.MANAGE])
      })
    })
  });
  const props = {
    recordType: "cases",
    mode: { isShow: true },
    record: Map({ status: "open" })
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
          Map({
            user: Map({
              permissions: Map({
                cases: List(["manage"])
              })
            })
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
          Map({
            user: Map({
              permissions: Map({
                cases: List(["read"])
              })
            })
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
