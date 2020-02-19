import { expect } from "chai";
import { Box, Button } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";

import TransferActions from "./transfer-actions";

describe("<TransferActions />", () => {
  let component;
  const props = {
    closeModal: () => {},
    disabled: true
  };

  describe("when disabled property is true", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(TransferActions, props));
    });

    it("renders Box", () => {
      expect(component.find(Box)).to.have.lengthOf(1);
    });

    it("renders 2 Buttons", () => {
      expect(component.find(Button)).to.have.lengthOf(2);
    });

    it("renders transfer button disabled with its corresponding class", () => {
      const transferButton = component.find("button[type='submit']");

      expect(transferButton.text()).to.be.equal("transfer.submit_label");
      expect(transferButton.props().disabled).to.be.true;
    });
  });

  describe("when disabled property is false", () => {
    const disabled = false;

    beforeEach(() => {
      ({ component } = setupMountedComponent(TransferActions, {
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

    it("renders transfer button enabled with its corresponding class", () => {
      const transferButton = component.find("button[type='submit']");

      expect(transferButton.text()).to.be.equal("transfer.submit_label");
      expect(transferButton.props().disabled).to.be.false;
    });
  });
});
