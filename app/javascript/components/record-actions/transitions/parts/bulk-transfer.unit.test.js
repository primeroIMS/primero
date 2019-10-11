import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import TransferCheckbox from "./transfer-checkbox";
import BulkTransfer from "./bulk-transfer";

describe("<BulkTransfer />", () => {
  let component;
  beforeEach(() => {
    ({ component } = setupMountedComponent(BulkTransfer, {}));
  });

  it("renders TransferCheckbox", () => {
    expect(component.find(TransferCheckbox)).to.have.length(1);
  });
});
