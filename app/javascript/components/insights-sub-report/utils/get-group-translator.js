// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { MONTH, QUARTER, WEEK, YEAR } from "../../insights/constants";

import translateMonth from "./translate-month";
import translateQuarter from "./translate-quarter";
import translateWeek from "./translate-week";

export default groupedBy =>
  ({
    [QUARTER]: translateQuarter,
    [MONTH]: translateMonth,
    [WEEK]: translateWeek,
    [YEAR]: value => value.toString()
  }[groupedBy]);
