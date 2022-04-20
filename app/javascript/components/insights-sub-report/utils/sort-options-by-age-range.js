export default (ageRanges, options) =>
  ageRanges.reduce((acc, range) => {
    const option = options.find(val => val === range);

    if (option) {
      return acc.concat(option);
    }

    return acc;
  }, []);
