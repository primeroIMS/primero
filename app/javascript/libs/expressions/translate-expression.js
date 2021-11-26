import first from "lodash/first";

const translateCondition = condition => {
  if (Object.keys(condition).length > 1) {
    return { and: Object.entries(condition).map(([key, value]) => translateCondition({ [key]: value })) };
  }

  const [key, value] = first(Object.entries(condition));

  if (Array.isArray(value)) {
    return { or: value.map(current => ({ eq: { [key]: current } })) };
  }

  return { eq: condition };
};

export default conditions => {
  if (conditions.length > 1) {
    return { or: conditions.map(condition => translateCondition(condition)) };
  }

  return translateCondition(first(conditions));
};
