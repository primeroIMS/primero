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

import { LAST_MONTH, LAST_QUARTER, LAST_YEAR, THIS_MONTH, THIS_QUARTER, THIS_YEAR } from "../insights/constants";

export const dateCalculations = option => {
  const date = new Date();

  const dateFunctions = {
    [THIS_QUARTER]: () => {
      return [startOfQuarter(date), endOfQuarter(date)];
    },
    [LAST_QUARTER]: () => {
      const lastQuarter = subQuarters(date, 1);

      return [startOfQuarter(lastQuarter), endOfQuarter(lastQuarter)];
    },
    [THIS_YEAR]: () => {
      return [startOfYear(date), endOfYear(date)];
    },
    [LAST_YEAR]: () => {
      const lastYear = subYears(date, 1);

      return [startOfYear(lastYear), endOfYear(lastYear)];
    },
    [THIS_MONTH]: () => {
      return [startOfMonth(date), endOfMonth(date)];
    },
    [LAST_MONTH]: () => {
      const lastMonth = subMonths(date, 1);

      return [startOfMonth(lastMonth), endOfMonth(lastMonth)];
    }
  };

  return dateFunctions(option);
};
