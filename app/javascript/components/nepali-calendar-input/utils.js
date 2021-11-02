/* eslint-disable import/prefer-default-export */
import { format } from "date-fns";
import adbs from "ad-bs-converter";
import isDate from "lodash/isDate";

import { convertFullDateToNepali } from "../../../../../nepali-datepicker-reactjs";

import { NE_DATE_CONVERSION_FORMAT } from "./constants";

const getDateTime = dateTime => {
  const date = isDate(dateTime) ? dateTime : new Date(dateTime);

  return { dateObj: date, time: dateTime };
};

const convertToNeDate = date => {
  if (!date) return null;

  const { dateObj, time } = getDateTime(date);

  const formattedDate = format(dateObj, NE_DATE_CONVERSION_FORMAT);
  const { day, month, year } = adbs.ad2bs(formattedDate).en;
  const convertedDateString = `${year}-0${month}-${day}`;

  return { ne: convertFullDateToNepali(convertedDateString), en: convertedDateString, time };
};

export { convertToNeDate };
