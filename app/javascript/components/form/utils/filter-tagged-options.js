import isEmpty from "lodash/isEmpty";

export default (options, tags) => {
  if (isEmpty(tags)) {
    return options;
  }

  return options.filter(option => option.tags && option.tags.some(tag => tags.includes(tag)));
};
