import React from "react";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import NAMESPACE from "../namespace";
import CommonDateRanges from "../../../key-performance-indicators/common-date-ranges";

import asKeyPerformanceIndicator from "./container";

describe("asKeyPerformanceIndicator()", () => {
  const identifier = "test";
  const Component = () => <h1>Component</h1>;
  const KPI = asKeyPerformanceIndicator(identifier, {})(Component);

  it("should return a connect function", () => {
    expect(asKeyPerformanceIndicator()).to.be.a("function");
  });

  describe("A working KPI", () => {
    const commonDateRanges = CommonDateRanges.from(new Date(), () => {});
    const dateRanges = [commonDateRanges.Last3Months];
    const { component } = setupMountedComponent(
      KPI,
      { dateRanges },
      fromJS({
        records: {
          [NAMESPACE]: {
            [identifier]: "some test data"
          }
        }
      })
    );

    it("should get data for the component from the store", () => {
      expect(component.find(Component).prop("data")).to.equal("some test data");
    });
  });
});
