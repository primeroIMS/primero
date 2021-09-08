import { subMonths, startOfMonth, endOfMonth } from "date-fns";

import DateRange from "./date-range";
import { ALL_TIME, CURRENT_MONTH, MONTHS_3, MONTHS_6, MONTHS_12 } from "./constants";

const CommonDateRanges = {
  from(today = new Date(), i18n) {
    return {
      AllTime: new DateRange(
        ALL_TIME,
        i18n.t("key_performance_indicators.time_periods.all_time"),
        new Date(Date.parse("01/01/2000")),
        endOfMonth(today)
      ),
      CurrentMonth: new DateRange(
        CURRENT_MONTH,
        i18n.t("key_performance_indicators.time_periods.current_month"),
        startOfMonth(today),
        endOfMonth(today)
      ),
      Last3Months: new DateRange(
        MONTHS_3,
        i18n.t("key_performance_indicators.time_periods.last_3_months"),
        startOfMonth(subMonths(today, 2)),
        endOfMonth(today)
      ),
      Last6Months: new DateRange(
        MONTHS_6,
        i18n.t("key_performance_indicators.time_periods.last_6_months"),
        startOfMonth(subMonths(today, 5)),
        endOfMonth(today)
      ),
      LastYear: new DateRange(
        MONTHS_12,
        i18n.t("key_performance_indicators.time_periods.last_1_year"),
        startOfMonth(subMonths(today, 11)),
        endOfMonth(today)
      )
    };
  }
};

export default CommonDateRanges;
