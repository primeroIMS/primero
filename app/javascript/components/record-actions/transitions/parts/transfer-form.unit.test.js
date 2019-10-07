import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { NotImplemented } from "components/not-implemented";
import TransferForm from "./transfer-form";

describe("<TransferForm />", () => {
  let component;
  beforeEach(() => {
    ({ component } = setupMountedComponent(TransferForm, {}));
  });

  it("renders NotImplemented", () => {
    expect(component.find(NotImplemented)).to.have.length(1);
  });
});
