import { subMonths, startOfMonth, endOfMonth } from "date-fns";

import DateRange from "./date-range";

const CommonDateRanges = {
  from(today = new Date(), translate = (s) => s) {
    return {
      AllTime: new DateRange(
        "all-time",
        translate("key_performance_indicators.time_periods.all_time"),
        new Date(Date.parse("01/01/2000")),
        endOfMonth(today)
      ),
      CurrentMonth: new DateRange(
        "current-month",
        translate("key_performance_indicators.time_periods.current_month"),
        startOfMonth(today),
        endOfMonth(today)
      ),
      Last3Months: new DateRange(
        "3-months",
        translate("key_performance_indicators.time_periods.last_3_months"),
        startOfMonth(subMonths(today, 2)),
        endOfMonth(today)
      ),
      Last6Months: new DateRange(
        "6-months",
        translate("key_performance_indicators.time_periods.last_6_months"),
        startOfMonth(subMonths(today, 5)),
        endOfMonth(today)
      ),
      LastYear: new DateRange(
        "12-months",
        translate("key_performance_indicators.time_periods.last_1_year"),
        startOfMonth(subMonths(today, 11)),
        endOfMonth(today)
      )
    };
  }
};

export default CommonDateRanges;
