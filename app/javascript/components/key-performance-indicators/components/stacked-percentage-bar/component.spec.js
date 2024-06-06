// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "../../../../test-utils";

import StackedPercentageBar from "./component";

describe("<StackedPercentageBar />", () => {
  describe("with a single percentage", () => {
    mountedComponent(
      <StackedPercentageBar
        {...{
          percentages: [
            {
              percentage: 0.5,
              label: "Tests"
            }
          ]
        }}
      />
    );

    it("should display the label", () => {
      expect(screen.getByText("Tests")).toBeInTheDocument();
    });

    it("should display the percentage", () => {
      expect(screen.getByText("50%")).toBeInTheDocument();
    });
  });

  describe("with 2 percentages", () => {
    const percentage0 = { percentage: 0, label: "Shrödinger's Tests" };
    const percentage1 = { percentage: 0.35, label: "Passed" };
    const percentage2 = { percentage: 0.147, label: "Failed" };

    describe("where 1 percentage is 0%", () => {
      mountedComponent(
        <StackedPercentageBar
          {...{
            percentages: [percentage0, percentage1]
          }}
        />
      );

      it("should display percentage bars when the percentage is > 0", () => {
        expect(document.querySelectorAll(".StackedPercentageBarLabelContainer")[2]).toHaveStyle({ width: "35%" });
      });

      it("should not display a percentage bar for percentages <= 0", () => {
        expect(document.querySelectorAll(".StackedPercentageBarLabelContainer")[1]).toHaveStyle({ width: "auto" });
      });
    });

    describe("where both percentages are > 0", () => {
      mountedComponent(
        <StackedPercentageBar
          {...{
            percentages: [percentage1, percentage2]
          }}
        />
      );

      it("it shows percentage1", () => {
        expect(screen.getAllByText(percentage1.label)).toHaveLength(2);
        expect(document.querySelectorAll(".StackedPercentageBarLabelContainer")[3]).toHaveStyle({ width: "35%" });
      });

      it("should show percentage2", () => {
        expect(screen.getByText(percentage2.label)).toBeInTheDocument();
        expect(document.querySelectorAll(".StackedPercentageBarLabelContainer")[4]).toHaveStyle({ width: "14.7%" });
      });
    });

    it("should error when >2 percentages are passed", () => {
      const render = () =>
        mountedComponent(
          <StackedPercentageBar
            {...{
              percentages: [percentage0, percentage1, percentage2]
            }}
          />
        );

      expect(render).toThrow();
    });
  });
});
