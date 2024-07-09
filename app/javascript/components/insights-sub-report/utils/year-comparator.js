// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (elem1, elem2) => {
  const year1 = parseInt(elem1, 10);
  const year2 = parseInt(elem2, 10);

  if (year1 === year2) {
    return 0;
  }

  if (year1 > year2) {
    return 1;
  }

  return -1;
};
