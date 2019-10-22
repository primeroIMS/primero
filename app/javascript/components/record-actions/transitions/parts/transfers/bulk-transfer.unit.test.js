import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import TransferCheckbox from "./transfer-checkbox";
import BulkTransfer from "./bulk-transfer";

describe("<BulkTransfer />", () => {
  let component;

  describe("when isBulkTransfer='true'", () => {
    const props = { isBulkTransfer: true };
    beforeEach(() => {
      ({ component } = setupMountedComponent(BulkTransfer, props));
    });

    it("renders TransferCheckbox", () => {
      expect(component.find(TransferCheckbox)).to.have.length(1);
    });
  });

  describe("when isBulkTransfer='false'", () => {
    const props = { isBulkTransfer: false };
    beforeEach(() => {
      ({ component } = setupMountedComponent(BulkTransfer, props));
    });

    it("renders null", () => {
      expect(component).to.be.empty;
    });
  });
});
