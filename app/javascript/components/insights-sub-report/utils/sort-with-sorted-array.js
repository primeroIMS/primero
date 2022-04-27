export default (rows, sortedArray, sortByFn) =>
  rows.sort((elem1, elem2) => {
    if (sortByFn) {
      return sortedArray.indexOf(sortByFn(elem1)) - sortedArray.indexOf(sortByFn(elem2));
    }

    return sortedArray.indexOf(elem1) - sortedArray.indexOf(elem2);
  });
