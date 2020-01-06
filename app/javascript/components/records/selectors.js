import { Map, List } from "immutable";

export const selectRecord = (state, mode, recordType, id) => {
  if (mode.isEdit || mode.isShow) {
    const index = state
      .getIn(["records", recordType, "data"])
      .findIndex(r => r.get("id") === id);

    return state.getIn(["records", recordType, "data", index], Map({}));
  }

  return null;
};

export const selectRecordAttribute = (state, recordType, id, attribute) => {
  const index = state
    .getIn(["records", recordType, "data"], List([]))
    .findIndex(r => r.get("id") === id);

  if (index >= 0) {
    return state.getIn(["records", recordType, "data", index, attribute], "");
  }

  return "";
};

export const selectRecordsByIndexes = (state, recordType, indexes) => {
  if (!indexes) return [];

  return indexes.map(index =>
    state.getIn(["records", recordType, "data"], List([])).get(index)
  );
};
