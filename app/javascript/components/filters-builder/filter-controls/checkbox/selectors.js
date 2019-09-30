import { Map } from "immutable";

export const getCheckBoxes = (state, props, namespace) => {
  const { field_name: fieldName } = props;
  let selector = null;
  if (fieldName === "my_cases") {
    selector = Map({
      "my_cases[owned_by]": state.getIn(
        ["records", namespace, "filters", "my_cases[owned_by]"],
        []
      ),
      "my_cases[assigned_user_names]": state.getIn(
        ["records", namespace, "filters", "my_cases[assigned_user_names]"],
        []
      )
    });
  } else {
    selector = state.getIn(["records", namespace, "filters", fieldName], []);
  }
  return selector;
};
