import { expect } from "chai";
import { Box, Button } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";

import ReferralActions from "./actions";

describe("<ReferralActions />", () => {
  let component;
  const props = {
    handleClose: () => {},
    disabled: true
  };

  describe("when disabled property is true", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(ReferralActions, props));
    });

    it("renders Box", () => {
      expect(component.find(Box)).to.have.lengthOf(1);
    });

    it("renders 2 Buttons", () => {
      expect(component.find(Button)).to.have.lengthOf(2);
    });

    it("renders 1 Button disabled", () => {
      expect(
        component
          .find(Button)
          .first()
          .props().disabled
      ).to.be.equal(true);
    });
  });

  describe("when disabled property is false", () => {
    const disabled = false;

    beforeEach(() => {
      ({ component } = setupMountedComponent(ReferralActions, {
        ...props,
        disabled
      }));
    });

    it("renders Box", () => {
      expect(component.find(Box)).to.have.lengthOf(1);
    });

    it("renders 2 Buttons", () => {
      expect(component.find(Button)).to.have.lengthOf(2);
    });

    it("renders 1 Button enabled", () => {
      expect(
        component
          .find(Button)
          .first()
          .props().disabled
      ).to.be.equal(false);
    });
  });
});
