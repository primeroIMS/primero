// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import NAMESPACE from "../../namespace";
import CommonDateRanges from "../../utils/common-date-ranges";
import { mountedComponent, screen } from "../../../../test-utils";

import asKeyPerformanceIndicator from "./component";

describe("asKeyPerformanceIndicator()", () => {
  const identifier = "test";

  // eslint-disable-next-line react/display-name
  function Component() {
    return <h1>Component</h1>;
  }
  const permittedAction = "test";
  const KPI = asKeyPerformanceIndicator(identifier, {}, permittedAction)(Component);

  describe("A working KPI", () => {
    const commonDateRanges = CommonDateRanges.from(new Date(), { t: () => {} });
    const dateRanges = [commonDateRanges.Last3Months];

    mountedComponent(
      <KPI dateRanges={dateRanges} />,
      fromJS({
        records: {
          [NAMESPACE]: {
            [identifier]: "some test data"
          }
        },
        user: { permissions: { kpis: [permittedAction] } }
      })
    );

    it.skip("should get data for the component from the store", () => {
      expect(screen.getByText("some test data")).toBeInTheDocument();
    });
  });
});
