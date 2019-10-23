import { List } from "immutable";
import { forms } from "components/records"

export const selectListHeaders = (state, namespace) =>
  state.getIn(["user", "listHeaders", namespace], List([]));

export const selectFields = (state, { recordType, primeroModule }) => {
  const formSections = state.getIn([NAMESPACE, "formSections"]).filter(
    fs =>
      fs.parent_form === recordType &&
      fs.visible &&
      !fs.is_nested
  ).groupBy(primeroModule);
  console.log('formSections', formSections);

  // const selectedForms = forms(state, query).map(f => f.fields).filter(field => field.show_on_minify_form === true);

  // return selectedForms;
}