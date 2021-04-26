import CommonDateRanges from "../../utils/common-date-ranges";
import { setupMountedComponent } from "../../../../test";

import DateRangeSelect from "./component";

describe("<DateRangeSelect />", () => {
  const i18n = { t: () => "", toTime: () => "" };
  const commonDateRanges = CommonDateRanges.from(new Date(), { t: () => {} });

  const ranges = [commonDateRanges.Last3Months, commonDateRanges.Last6Months, commonDateRanges.LastYear];

  const selectedRange = commonDateRanges.Last3Months;

  it("should display the given set of ranges");

  it("should show the selected range", () => {
    const { component } = setupMountedComponent(DateRangeSelect, {
      ranges,
      selectedRange,
      i18n
    });

    expect(component.find(`input[value="${selectedRange.value}"]`).exists()).to.be.true;
  });

  it("should display a custom range when withCustomRange is set");
});
