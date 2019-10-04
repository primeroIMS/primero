import { Set, List, fromJS, Map } from "immutable";

export const keyIn = (...keys) => {
  const keySet = Set(keys);
  return (v, k) => {
    return keySet.has(k);
  };
};

export const mergeDeepArrays = (state, value) => {
  const mergeArrays = (data, basePath) => {
    let next = data;

    data.forEach((v, k) => {
      const path = basePath.concat([k]);
      if (List.isList(v)) {
        if (state.hasIn(path)) {
          const current = state.getIn(path);

          if (List.isList(current) && !current.isEmpty()) {
            // eslint-disable-next-line no-param-reassign
            state = state.setIn(path, Set(current).merge(v));
            next = next.deleteIn(path);
          }
        }
      } else if (Map.isMap(v)) {
        next = next.setIn(path, mergeArrays(v, path));
      }
    });

    return next;
  };

  const updatedData = mergeArrays(fromJS(value), []);

  return state.mergeDeep(updatedData);
};
