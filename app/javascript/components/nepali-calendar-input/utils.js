/* eslint-disable import/prefer-default-export */
import { format } from "date-fns";
import adbs from "ad-bs-converter";
import isDate from "lodash/isDate";
import { convertFullDateToNepali } from "@quoin/nepali-datepicker-reactjs";

import { NE_DATE_CONVERSION_FORMAT } from "./constants";

const getDateTimeObj = dateTime => {
  const date = isDate(dateTime) ? dateTime : new Date(dateTime);

  return date;
};

const convertToNeDate = date => {
  if (!date) return {};

  const dateObj = getDateTimeObj(date);

  const formattedDate = format(dateObj, NE_DATE_CONVERSION_FORMAT);
  const { day, month, year } = adbs.ad2bs(formattedDate).en;
  const convertedDateString = `${year}-${String(month).padStart(2, "0")}-${day}`;

  return { ne: convertFullDateToNepali(convertedDateString) || null, en: convertedDateString, time: dateObj };
};

export { convertToNeDate };
