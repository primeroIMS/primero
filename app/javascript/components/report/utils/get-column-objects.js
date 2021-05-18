import omit from "lodash/omit";

export default (object, countRows) => {
  let level = 0;

  // eslint-disable-next-line consistent-return
  const getColumnsObj = obj => {
    if (level >= countRows) {
      return obj;
    }

    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i += 1) {
      level += 1;

      return getColumnsObj(obj[keys[i]]);
    }
  };

  // Removing "_total" from columns object
  return omit(getColumnsObj(object), "_total");
};
