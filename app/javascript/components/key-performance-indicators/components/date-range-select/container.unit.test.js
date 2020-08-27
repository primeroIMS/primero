import CommonDateRanges from "../../common-date-ranges";
import { setupMountedComponent } from "../../../../test";

import DateRangeSelect from "./container";

describe("<DateRangeSelect />", () => {
  const commonDateRanges = CommonDateRanges.from();

  const ranges = [
    commonDateRanges.Last3Months,
    commonDateRanges.Last6Months,
    commonDateRanges.LastYear
  ];

  const selectedRange = commonDateRanges.Last3Months;

  // NOTE:  Not sure how to effectively run these test since the Select
  //        component from material UI seems to work outside of the DOM
  //        tree for the component (Spooky action at a distance). If we
  //        could find the correct element to simulate a click to open
  //        the input and then a method to query for input nodes.
  it("should display the given set of ranges");

  it("should show the selected range", () => {
    const { component } = setupMountedComponent(DateRangeSelect, {
      ranges,
      selectedRange
    });

    expect(component.find(`input[value="${selectedRange.value}"]`).exists()).to
      .be.true;
  });

  it("should display a custom range when withCustomRange is set");
});
