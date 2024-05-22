// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (elem1, elem2) => {
  const month1 = parseInt(elem1, 10);
  const month2 = parseInt(elem2, 10);

  return month1 - month2;
};
