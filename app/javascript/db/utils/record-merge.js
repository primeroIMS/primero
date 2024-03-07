import merge from "deepmerge";

import subformAwareMerge from "./subform-aware-merge";

export default (prev, current, key) => {
  const item = key ? { ...current, ...key } : current;

  return merge(prev, item, {
    arrayMerge: subformAwareMerge,
    // eslint-disable-next-line consistent-return
    customMerge: prop => {
      if (prop === "permitted_forms") {
        return (_formsA, formsB) => formsB;
      }
    }
  });
};
