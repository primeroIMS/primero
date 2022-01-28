/* eslint-disable import/prefer-default-export */

import {
  endOfMonth,
  endOfQuarter,
  endOfYear,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subMonths,
  subQuarters,
  subYears
} from "date-fns";

import {
  CUSTOM,
  LAST_MONTH,
  LAST_QUARTER,
  LAST_YEAR,
  THIS_MONTH,
  THIS_QUARTER,
  THIS_YEAR
} from "../insights/constants";

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
    [CUSTOM]: () => {
      return { from, to };
    }
  };

  return dateFunctions[option]();
};
