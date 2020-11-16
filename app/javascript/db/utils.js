/* eslint-disable camelcase, import/prefer-default-export  */
import merge from "deepmerge";

export const subformAwareMerge = (target, source, options) =>
  source.map(item => {
    if (options.isMergeableObject(item) && (item?.id || item?.unique_id)) {
      const targetItem = item?.id
        ? target.find(t => t?.id === item?.id)
        : target.find(t => t?.unique_id === item?.unique_id);

      return targetItem ? merge(targetItem, item, options) : item;
    }

    return item;
  });
