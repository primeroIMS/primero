// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../test-utils";

import InternalAlert from "./component";

describe("<InternalAlert />", () => {
  it("renders the InternalAlert", () => {
    mountedComponent(<InternalAlert {...{ items: fromJS([{ message: "Alert Message 1" }]), severity: "warning" }} />);

    expect(screen.getByText("Alert Message 1")).toBeInTheDocument();
  });

  it("does not render details if there is only one alert", () => {
    mountedComponent(<InternalAlert {...{ items: fromJS([{ message: "Alert Message 1" }]), severity: "warning" }} />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders details if there are several alert", () => {
    mountedComponent(
      <InternalAlert
        {...{
          items: fromJS([{ message: "Alert Message 1" }, { message: "Alert Message 2" }]),
          severity: "warning"
        }}
      />
    );

    expect(screen.getByText("Alert Message 1")).toBeInTheDocument();
    expect(screen.getByText("Alert Message 2")).toBeInTheDocument();
  });

  it("renders the specified title", () => {
    const title = "This is the title";

    mountedComponent(
      <InternalAlert
        {...{
          title,
          items: fromJS([{ message: "Alert Message 1" }, { message: "Alert Message 2" }]),
          severity: "warning"
        }}
      />
    );

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("renders a dismiss button if onDismiss is on an item", () => {
    mountedComponent(
      <InternalAlert
        {...{
          items: fromJS([{ message: "Alert Message 1", onDismiss: () => {} }]),
          severity: "warning"
        }}
      />
    );

    expect(document.querySelector(".dismissButton")).toBeInTheDocument();
  });

  it("does not render a dismiss button if onDismiss is not on an item", () => {
    mountedComponent(
      <InternalAlert
        {...{
          items: fromJS([{ message: "Alert Message 1" }]),
          severity: "warning"
        }}
      />
    );

    expect(document.querySelector(".dismissButton")).not.toBeInTheDocument();
  });
});
