// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (groupKey, localizeDate) => {
  const monthNumber = groupKey.substring(1) * 3 - 1;
  const dummyDate = new Date(2022, monthNumber, 1, 0, 0, 0);

  return localizeDate(dummyDate, "qqq");
};
