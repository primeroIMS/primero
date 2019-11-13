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

    it("renders Refer button disabled with its corresponding class", () => {
      const referButton = component.find("button[type='submit']");

      expect(referButton.text()).to.be.equal("buttons.referral");
      expect(referButton.props().disabled).to.be.true;
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

    it("renders Refer button enabled with its corresponding class", () => {
      const referButton = component.find("button[type='submit']");

      expect(referButton.text()).to.be.equal("buttons.referral");
      expect(referButton.props().disabled).to.be.false;
    });
  });
});
