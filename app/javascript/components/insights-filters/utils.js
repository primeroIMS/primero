// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import {
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  isDate,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  subMonths,
  subQuarters,
  subWeeks,
  subYears
} from "date-fns";
import isNil from "lodash/isNil";
import omitBy from "lodash/omitBy";

import { toServerDateFormat } from "../../libs";
import {
  CUSTOM,
  LAST_MONTH,
  LAST_QUARTER,
  LAST_WEEK,
  LAST_YEAR,
  THIS_MONTH,
  THIS_QUARTER,
  THIS_WEEK,
  THIS_YEAR
} from "../insights/constants";

const startOfWeekOptions = { options: { weekStartsOn: 0 } };

const formatDate = date => (isDate(date) ? toServerDateFormat(date, { includeTime: true, normalize: false }) : date);

export const dateCalculations = (option, from, to) => {
  const date = new Date();

  const dateFunctions = {
    [THIS_QUARTER]: () => {
      return { from: startOfQuarter(date), to: endOfQuarter(date) };
    },
    [LAST_QUARTER]: () => {
      const lastQuarter = subQuarters(date, 1);

      return { from: startOfQuarter(lastQuarter), to: endOfQuarter(lastQuarter) };
    },
    [THIS_YEAR]: () => {
      return { from: startOfYear(date), to: endOfYear(date) };
    },
    [LAST_YEAR]: () => {
      const lastYear = subYears(date, 1);

      return { from: startOfYear(lastYear), to: endOfYear(lastYear) };
    },
    [THIS_MONTH]: () => {
      return { from: startOfMonth(date), to: endOfMonth(date) };
    },
    [LAST_MONTH]: () => {
      const lastMonth = subMonths(date, 1);

      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    },
    [THIS_WEEK]: () => {
      return { from: startOfWeek(date, startOfWeekOptions), to: endOfWeek(date, startOfWeekOptions) };
    },
    [LAST_WEEK]: () => {
      const lastMonth = subWeeks(date, 1);

      return { from: startOfWeek(lastMonth, startOfWeekOptions), to: endOfWeek(lastMonth, startOfWeekOptions) };
    },
    [CUSTOM]: () => {
      return { from, to };
    }
  };

  const dateRange = dateFunctions[option]();

  return { from: formatDate(dateRange.from), to: formatDate(dateRange.to) };
};

export const transformFilters = data => {
  const { date, grouped_by: groupedBy, date_range: dateRange, to, from, ...rest } = data;

  return omitBy(
    {
      ...rest,
      ...(groupedBy && { grouped_by: groupedBy, [date]: dateCalculations(dateRange, from, to) })
    },
    isNil
  );
};
