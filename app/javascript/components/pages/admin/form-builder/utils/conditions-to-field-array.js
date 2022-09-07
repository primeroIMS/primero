import first from "lodash/first";

export default conditions => {
  if (!conditions || !Object.keys(conditions).length) {
    return [];
  }

  if (conditions.and) {
    return conditions.and.map(condition => {
      const [constraint, current] = first(Object.entries(condition));
      const [attribute, value] = first(Object.entries(current));

      return { constraint, attribute, value };
    });
  }

  const [constraint, condition] = first(Object.entries(conditions));
  const [attribute, value] = first(Object.entries(condition));

  return [{ constraint, attribute, value }];
};
