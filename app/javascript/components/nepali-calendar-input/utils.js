// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { format, parse } from "date-fns";
import isDate from "lodash/isDate";
import { ADToBS } from "bikram-sambat-js";

import { NE_DATE_CONVERSION_FORMAT } from "./constants";

const getDateTimeObj = dateTime => {
  const date = isDate(dateTime) ? dateTime : new Date(dateTime);

  return date;
};

const convertToNeDate = date => {
  if (!date) return "";

  const dateObj = getDateTimeObj(date);
  const formattedDate = format(dateObj, NE_DATE_CONVERSION_FORMAT);

  return ADToBS(formattedDate);
};

const parseDate = date => {
  return parse(date, NE_DATE_CONVERSION_FORMAT, new Date());
};

export { convertToNeDate, parseDate };
