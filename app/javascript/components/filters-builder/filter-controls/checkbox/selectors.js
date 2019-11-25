import { Map } from "immutable";

export const getCheckBoxes = (state, props, namespace) => {
  const { field_name: fieldName } = props;
  let selector = null;

  if (fieldName === "my_cases") {
    selector = Map({
      "or[owned_by]": state.getIn(
        ["records", namespace, "filters", "or[owned_by]"],
        []
      ),
      "or[assigned_user_names]": state.getIn(
        ["records", namespace, "filters", "or[assigned_user_names]"],
        []
      )
    });
  } else {
    selector = state.getIn(["records", namespace, "filters", fieldName], []);
  }

  return selector;
};
