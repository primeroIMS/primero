export default (rows, sortedArray, sortByFn, incompleteDataLabel) =>
  rows.sort((elem1, elem2) => {
    const value1 = sortByFn ? sortByFn(elem1) : elem1;
    const value2 = sortByFn ? sortByFn(elem2) : elem2;

    if (incompleteDataLabel === value2 && incompleteDataLabel === value1) {
      return 0;
    }

    if (incompleteDataLabel === value1 && incompleteDataLabel !== value2) {
      return 1;
    }

    if (incompleteDataLabel !== value1 && incompleteDataLabel === value2) {
      return -1;
    }

    return sortedArray.indexOf(value1) - sortedArray.indexOf(value2);
  });
