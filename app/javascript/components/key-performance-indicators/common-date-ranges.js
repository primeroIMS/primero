import { addMinutes, subMinutes, subMonths, startOfMonth, endOfMonth } from "date-fns";

import DateRange from "./date-range";

// Taken from: https://github.com/date-fns/date-fns/issues/571#issuecomment-602496322
// This fixes an issue where dates are out by 1 hour because of timezone issues.

const CommonDateRanges = {
  adjustTimezone(target, source) {
    const targetTZO = target.getTimezoneOffset();
    const sourceTZO = source.getTimezoneOffset();

    const dstDiff = targetTZO - sourceTZO;

    var finalDate = dstDiff >= 0
      ? addMinutes(source, dstDiff)
      : subMinutes(source, Math.abs(dstDiff));

    return finalDate;
  },
  from(today = new Date(), translate = (s) => s) {
    console.log('*****', today, this.adjustTimezone(today, startOfMonth(subMonths(today, 2))))

    return {
      AllTime: new DateRange(
        "all-time",
        translate("key_performance_indicators.time_periods.all_time"),
        new Date(Date.parse("01/01/2000")),
        this.adjustTimezone(today, endOfMonth(today))
      ),
      CurrentMonth: new DateRange(
        "current-month",
        translate("key_performance_indicators.time_periods.current_month"),
        this.adjustTimezone(today, startOfMonth(today)),
        this.adjustTimezone(today, endOfMonth(today))
      ),
      Last3Months: new DateRange(
        "3-months",
        translate("key_performance_indicators.time_periods.last_3_months"),
        this.adjustTimezone(today, startOfMonth(subMonths(today, 2))),
        this.adjustTimezone(today, endOfMonth(today))
      ),
      Last6Months: new DateRange(
        "6-months",
        translate("key_performance_indicators.time_periods.last_6_months"),
        this.adjustTimezone(today, startOfMonth(subMonths(today, 5))),
        this.adjustTimezone(today, endOfMonth(today))
      ),
      LastYear: new DateRange(
        "12-months",
        translate("key_performance_indicators.time_periods.last_1_year"),
        this.adjustTimezone(today, startOfMonth(subMonths(today, 11))),
        this.adjustTimezone(today, endOfMonth(today))
      )
    };
  }
};

export default CommonDateRanges;
