import isEmpty from "lodash/isEmpty";

export default (lookups, translateId, key, value, property = "id") => {
  const valueKeyLookups = lookups[key];

  if (isEmpty(valueKeyLookups)) {
    return translateId(value.get(property));
  }

  // eslint-disable-next-line camelcase
  return valueKeyLookups.find(lookup => lookup.id === value.get("id"))?.display_text || value.get("id");
};
