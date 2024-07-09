// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import CommonDateRanges from "../../utils/common-date-ranges";
import { mountedComponent } from "../../../../test-utils";

import DateRangeSelect from "./component";

describe("<DateRangeSelect />", () => {
  const i18n = { t: () => "", toTime: () => "" };
  const commonDateRanges = CommonDateRanges.from(new Date(), { t: () => {} });

  const ranges = [commonDateRanges.Last3Months, commonDateRanges.Last6Months, commonDateRanges.LastYear];

  const selectedRange = commonDateRanges.Last3Months;

  it.todo("should display the given set of ranges");

  it("should show the selected range", () => {
    const props = {
      ranges,
      selectedRange,
      i18n
    };

    mountedComponent(<DateRangeSelect {...props} />);

    expect(document.querySelector(`input[value="${selectedRange.value}"]`)).toBeInTheDocument();
  });

  it.todo("should display a custom range when withCustomRange is set");
});
