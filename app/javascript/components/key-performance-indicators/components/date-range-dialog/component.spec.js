// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { format } from "date-fns";

import { fireEvent, mountedComponent, screen } from "../../../../test-utils";
import { DATE_FORMAT } from "../../../../config";

import DateRangeDialog from "./component";

describe("<DateRangeDialog />", () => {
  const currentRange = {
    from: new Date(),
    to: new Date()
  };

  it("should render dialog content when open", () => {
    mountedComponent(
      <DateRangeDialog
        {...{
          open: true,
          currentRange
        }}
      />
    );

    expect(screen.queryByRole("dialog")).toBeInTheDocument();
  });

  it("shouldn't render dialog content when closed", () => {
    mountedComponent(
      <DateRangeDialog
        {...{
          open: false,
          currentRange
        }}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should call onClose when the dialog is closed", () => {
    const onClose = jest.fn();

    mountedComponent(
      <DateRangeDialog
        {...{
          open: true,
          currentRange,
          onClose
        }}
      />
    );

    fireEvent.click(document.querySelector(".MuiBackdrop-root"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should render the currentRange", () => {
    mountedComponent(
      <DateRangeDialog
        {...{
          open: true,
          currentRange
        }}
      />
    );

    expect(screen.getAllByDisplayValue(format(currentRange.to, DATE_FORMAT)).at(0)).toBeInTheDocument();
    expect(screen.getAllByDisplayValue(format(currentRange.from, DATE_FORMAT)).at(1)).toBeInTheDocument();
  });

  it("should call setRange when Button is clicked", () => {
    const setRange = jest.fn();

    mountedComponent(
      <DateRangeDialog
        {...{
          open: true,
          currentRange,
          onClose: () => {},
          setRange
        }}
      />
    );

    fireEvent.click(screen.getAllByRole("button").at(2));

    expect(setRange).toHaveBeenCalledTimes(1);
  });
});
