// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (rows, sortedArray, sortByFn) =>
  rows.sort((elem1, elem2) => {
    const value1 = sortByFn ? sortByFn(elem1) : elem1;
    const value2 = sortByFn ? sortByFn(elem2) : elem2;

    return sortedArray.indexOf(value1) - sortedArray.indexOf(value2);
  });
