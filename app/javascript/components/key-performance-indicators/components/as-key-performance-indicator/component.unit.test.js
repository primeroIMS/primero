import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import NAMESPACE from "../../namespace";
import CommonDateRanges from "../../utils/common-date-ranges";

import asKeyPerformanceIndicator from "./component";

describe("asKeyPerformanceIndicator()", () => {
  const identifier = "test";
  const Component = () => <h1>Component</h1>;
  const permittedAction = "test";
  const KPI = asKeyPerformanceIndicator(identifier, {}, permittedAction)(Component);

  it("should return a connect function", () => {
    expect(asKeyPerformanceIndicator()).to.be.a("function");
  });

  describe("A working KPI", () => {
    const commonDateRanges = CommonDateRanges.from(new Date(), { t: () => {} });
    const dateRanges = [commonDateRanges.Last3Months];
    const { component } = setupMountedComponent(
      KPI,
      { dateRanges },
      fromJS({
        records: {
          [NAMESPACE]: {
            [identifier]: "some test data"
          }
        },
        user: { permissions: { kpis: [permittedAction] } }
      })
    );

    it("should get data for the component from the store", () => {
      expect(component.find(Component).prop("data")).to.equal("some test data");
    });
  });
});
