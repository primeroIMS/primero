import { SnackbarProvider } from "notistack";

import { setupMountedComponent } from "../../test";

import CustomSnackbarProvider from "./component";

describe("<CustomSnackbarProvider /> - Component", () => {
  let component;

  before(() => {
    ({ component } = setupMountedComponent(CustomSnackbarProvider, {
      children: <div />
    }));
  });

  it("renders <CustomSnackbarProvider/>", () => {
    expect(component.find(CustomSnackbarProvider)).to.have.lengthOf(1);
  });

  it("renders <SnackbarProvider/>", () => {
    expect(component.find(CustomSnackbarProvider).find(SnackbarProvider)).to.have.lengthOf(1);
  });
});
