import { DateRange } from "./date-range-select";
import { useI18n } from "components/i18n";
import { subMonths, addMonths, startOfMonth, endOfMonth } from "date-fns";

// not sure how to use i18n outside of react yet.
let i18n = window.I18n;

const CommonDateRanges = {
  from(today) {
    today = today || new Date();

    return {
      AllTime: new DateRange(
        'all-time',
        i18n.t('key_performance_indicators.time_periods.all_time'),
        // earliest date representable
        new Date(-8640000000000000),
        endOfMonth(today)),
      CurrentMonth: new DateRange(
        'current-month',
        i18n.t('key_performance_indicators.time_periods.current_month'),
        startOfMonth(today),
        endOfMonth(today)),
      Last3Months: new DateRange(
        '3-months',
        i18n.t('key_performance_indicators.time_periods.last_3_months'),
        startOfMonth(subMonths(today, 2)),
        endOfMonth(today)),
      Last6Months: new DateRange(
        '6-months',
        i18n.t('key_performance_indicators.time_periods.last_6_months'),
        startOfMonth(subMonths(today, 5)),
        endOfMonth(today)),
      LastYear: new DateRange(
        '12-months',
        i18n.t('key_performance_indicators.time_periods.last_year'),
        startOfMonth(subMonths(today, 11)),
        endOfMonth(today)),
    }
  }
}

export default CommonDateRanges;
