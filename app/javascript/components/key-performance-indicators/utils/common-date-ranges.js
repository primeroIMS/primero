import DateRange from "./date-range";
import UTCDate from "./utc-date";

import { ALL_TIME, CURRENT_MONTH, MONTHS_3, MONTHS_6, MONTHS_12 } from "./constants";

const CommonDateRanges = {
  from(today, i18n) {
    const todayUTC = UTCDate.fromDate(today)
    const oldestDate = new UTCDate(1900, 0, 0)

    return {
      AllTime: new DateRange(
        ALL_TIME,
        i18n.t("key_performance_indicators.time_periods.all_time"),
        oldestDate,
        todayUTC.endOfMonth()
      ),
      CurrentMonth: new DateRange(
        CURRENT_MONTH,
        i18n.t("key_performance_indicators.time_periods.current_month"),
        todayUTC.startOfMonth(),
        todayUTC.endOfMonth()
      ),
      Last3Months: new DateRange(
        MONTHS_3,
        i18n.t("key_performance_indicators.time_periods.last_3_months"),
        todayUTC.subMonths(2).startOfMonth(),
        todayUTC.endOfMonth()
      ),
      Last6Months: new DateRange(
        MONTHS_6,
        i18n.t("key_performance_indicators.time_periods.last_6_months"),
        todayUTC.subMonths(5).startOfMonth(),
        todayUTC.endOfMonth()
      ),
      LastYear: new DateRange(
        MONTHS_12,
        i18n.t("key_performance_indicators.time_periods.last_1_year"),
        todayUTC.subMonths(11).startOfMonth(),
        todayUTC.endOfMonth()
      )
    };
  }
};

export default CommonDateRanges;
