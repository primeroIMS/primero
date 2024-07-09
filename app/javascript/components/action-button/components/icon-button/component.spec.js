// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen, fireEvent, waitFor } from "test-utils";

import IconButton from "./component";

describe("<IconButton /> components/action-button/components", () => {
  const props = {
    icon: <></>,
    isTransparent: false,
    rest: {}
  };

  it("renders a <IconButton /> component", () => {
    const newProps = {
      ...props,
      className: "MuiSvgIcon-root"
    };

    mountedComponent(<IconButton {...newProps} />);
    expect(screen.getByRole("button")).toHaveClass("MuiSvgIcon-root");
  });

  it("renders a <Tooltip /> component if tooltip is defined", async () => {
    const newProps = {
      ...props,
      tooltip: "Tooltip Message",
      className: "MuiSvgIcon-root"
    };

    mountedComponent(<IconButton {...newProps} />);
    fireEvent.mouseOver(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByText("Tooltip Message")).toBeInTheDocument());
  });
});
