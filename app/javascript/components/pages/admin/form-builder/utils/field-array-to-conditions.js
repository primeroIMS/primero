export default conditionArray =>
  conditionArray.reduce(
    (acc, elem) => ({ and: [...acc.and, { [elem.constraint]: { [elem.attribute]: elem.value } }] }),
    {
      and: []
    }
  );
