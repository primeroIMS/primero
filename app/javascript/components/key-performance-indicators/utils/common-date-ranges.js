import { addMinutes, subMinutes, subMonths, startOfMonth, endOfMonth } from "date-fns";

import DateRange from "./date-range";
import { ALL_TIME, CURRENT_MONTH, MONTHS_3, MONTHS_6, MONTHS_12 } from "./constants";

// Taken from: https://github.com/date-fns/date-fns/issues/571#issuecomment-602496322
// This fixes an issue where dates are out by 1 hour because of timezone issues.

const CommonDateRanges = {
  adjustTimezone(target, source) {
    const targetTZO = target.getTimezoneOffset();
    const sourceTZO = source.getTimezoneOffset();

    const dstDiff = targetTZO - sourceTZO;

    const finalDate = dstDiff >= 0 ? addMinutes(source, dstDiff) : subMinutes(source, Math.abs(dstDiff));

    return finalDate;
  },
  from(today = new Date(), i18n) {
    return {
      AllTime: new DateRange(
        ALL_TIME,
        i18n.t("key_performance_indicators.time_periods.all_time"),
        new Date(Date.parse("01/01/2000")),
        this.adjustTimezone(today, endOfMonth(today))
      ),
      CurrentMonth: new DateRange(
        CURRENT_MONTH,
        i18n.t("key_performance_indicators.time_periods.current_month"),
        this.adjustTimezone(today, startOfMonth(today)),
        this.adjustTimezone(today, endOfMonth(today))
      ),
      Last3Months: new DateRange(
        MONTHS_3,
        i18n.t("key_performance_indicators.time_periods.last_3_months"),
        this.adjustTimezone(today, startOfMonth(subMonths(today, 2))),
        this.adjustTimezone(today, endOfMonth(today))
      ),
      Last6Months: new DateRange(
        MONTHS_6,
        i18n.t("key_performance_indicators.time_periods.last_6_months"),
        this.adjustTimezone(today, startOfMonth(subMonths(today, 5))),
        this.adjustTimezone(today, endOfMonth(today))
      ),
      LastYear: new DateRange(
        MONTHS_12,
        i18n.t("key_performance_indicators.time_periods.last_1_year"),
        this.adjustTimezone(today, startOfMonth(subMonths(today, 11))),
        this.adjustTimezone(today, endOfMonth(today))
      )
    };
  }
};

export default CommonDateRanges;
