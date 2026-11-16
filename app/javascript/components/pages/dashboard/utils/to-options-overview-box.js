import { fromJS } from "immutable";

const NO_CASES = Object.freeze({ count: 0, query: [] });

export default (data, indicatorName, options = []) => {
  const indicator = data.getIn(["indicators", indicatorName], fromJS({}));

  const indicators = options.reduce(
    (acc, option) => ({ ...acc, [option.id]: indicator.get(option.id, fromJS(NO_CASES)) }),
    {}
  );

  const labels = Object.fromEntries(options.map(option => [option.id, option.display_text]));

  return {
    items: fromJS({ indicators }),
    labels,
    displayOrder: options.map(option => option.id)
  };
};
