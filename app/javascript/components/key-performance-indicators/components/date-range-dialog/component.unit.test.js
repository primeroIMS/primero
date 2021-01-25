import { DialogContent, Button } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";

import { spy, setupMountedComponent } from "../../../../test";

import DateRangeDialog from "./component";

describe("<DateRangeDialog />", () => {
  const currentRange = {
    from: new Date(),
    to: new Date()
  };

  it("should render dialog content when open", () => {
    const { component } = setupMountedComponent(DateRangeDialog, {
      open: true,
      currentRange
    });

    expect(component.find(DialogContent)).to.have.length(1);
  });

  it("shouldn't render dialog content when closed", () => {
    const { component } = setupMountedComponent(DateRangeDialog, {
      open: false,
      currentRange
    });

    expect(component.find(DialogContent)).to.have.length(0);
  });

  it("should call onClose when the dialog is closed", () => {
    const onClose = spy();
    const { component } = setupMountedComponent(DateRangeDialog, {
      open: true,
      currentRange,
      onClose
    });

    component.find(".MuiBackdrop-root").simulate("click");

    expect(onClose).to.have.property("callCount", 1);
  });

  it("should render the currentRange", () => {
    const { component } = setupMountedComponent(DateRangeDialog, {
      open: true,
      currentRange
    });

    const datePickers = component.find(KeyboardDatePicker);

    expect(datePickers.find({ value: currentRange.from }).exists()).to.be.true;
    expect(datePickers.find({ value: currentRange.to }).exists()).to.be.true;
  });

  it("should call setRange when Button is clicked", () => {
    const setRange = spy();
    const { component } = setupMountedComponent(DateRangeDialog, {
      open: true,
      currentRange,
      onClose: () => {},
      setRange
    });

    component.find(Button).simulate("click");

    expect(setRange).to.have.property("callCount", 1);
  });
});
