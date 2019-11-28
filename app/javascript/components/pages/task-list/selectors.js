import {fromJS, List} from "immutable";

export const selectListHeaders = (state, namespace) =>
  state.getIn(["user", "listHeaders", namespace], List([]));

export const getServiceTypeLookupValues = state => {
  const lookup = state
    .getIn(["forms", "options", "lookups"], List([]))
    .filter(o => o.get("unique_id") === "lookup-service-type")
    .first()
    .get("values");

  return lookup;
};
