// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "../../../../test-utils";

import SingleAggregateMetric from "./component";

describe("<SingleAggregateMetric />", () => {
  it("Should display the given label", () => {
    mountedComponent(<SingleAggregateMetric label="Test" />);

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should display the given value", () => {
    mountedComponent(
      <SingleAggregateMetric
        {...{
          label: "Test",
          value: 50
        }}
      />
    );

    expect(screen.getByText("50")).toBeInTheDocument();
  });
});
