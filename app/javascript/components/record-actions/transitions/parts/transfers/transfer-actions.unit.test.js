import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Box, Button } from "@material-ui/core";
import TransferActions from "./transfer-actions";

describe("<TransferActions />", () => {
  let component;
  beforeEach(() => {
    ({ component } = setupMountedComponent(TransferActions, {
      closeModal: () => {}
    }));
  });

  it("renders Box", () => {
    expect(component.find(Box)).to.have.length(1);
  });

  it("renders Button", () => {
    expect(component.find(Button)).to.have.length(2);
  });
});
