// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "../../../../test-utils";

import TablePercentageBar from "./component";

describe("<TablePercentageBar />", () => {
  it("should display the percentage", () => {
    mountedComponent(<TablePercentageBar percentage={0.5} />);

    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  describe("when the percentage is small (< 10%)", () => {
    it("should display the percentage outside of the bar", () => {
      mountedComponent(<TablePercentageBar percentage={0.01} />);

      expect(screen.getByText("1%")).toBeInTheDocument();
    });
  });
});
