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

export const forms = (state, { recordType, primeroModule }) => {
  const formSections = state.getIn([NAMESPACE, "formSections"]);

  if (isEmpty(formSections)) return null;

  return formSections.filter(
    fs =>
      fs.module_ids.includes(primeroModule) &&
      fs.parent_form === recordType &&
      fs.visible &&
      !fs.is_nested
  );
};
