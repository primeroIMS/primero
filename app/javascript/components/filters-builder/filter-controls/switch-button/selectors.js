import { List } from "immutable";

export const selectSwitchButtons = (state, props, namespace) => {
  return state.getIn(
    ["records", namespace, "filters", props.field_name],
    List([])
  );
};
