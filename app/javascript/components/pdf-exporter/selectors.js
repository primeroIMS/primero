/* eslint-disable import/prefer-default-export */

export const getCustomFormTitle = (state, title, watch) => {
  if (typeof title === "object") {
    const { selector, selectorNameProp, watchedId } = title;

    return selector(state, watch(watchedId)).get(selectorNameProp);
  }

  return title;
};
