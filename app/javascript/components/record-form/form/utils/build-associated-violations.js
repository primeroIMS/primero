import isEmpty from "lodash/isEmpty";

export default (fieldName, values) => {
  if (fieldName !== "individual_victims" || isEmpty(values?.violation_category)) {
    return null;
  }

  return values?.violation_category.reduce((acc, violation) => {
    if (!values[violation]?.length) return acc;

    return { ...acc, [violation]: values[violation].map(val => val.unique_id) };
  }, {});
};
