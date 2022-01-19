import omit from "lodash/omit";

export default (object, countRows) => {
  let columnObjects = {};
  // eslint-disable-next-line consistent-return
  const getColumnsObj = (obj, level = 0) => {
    if (level >= countRows) {
      return obj;
    }

    const keys = Object.keys(obj);

    // eslint-disable-next-line no-param-reassign
    level += 1;

    for (let i = 0; i < keys.length; i += 1) {
      const columnObj = getColumnsObj(obj[keys[i]], level);

      columnObjects = columnObj ? { ...columnObjects, ...columnObj } : columnObjects;
    }

    return columnObjects;
  };

  // Removing "_total" from columns object
  return omit(getColumnsObj(object), "_total");
};
