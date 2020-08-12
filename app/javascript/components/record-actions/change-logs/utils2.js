const { updateSelectedField } = require("./app/javascript/components/pages/admin/form-builder/action-creators");


        if (fieldRecord?.get("type") === "subform" || fieldName === APPROVALS) {
          // should render a new component for subform
          const newSubforms = newSubformsData(
            fieldChanges.from,
            fieldChanges.to
          );

          debugger;

          console.log(newSubforms);
        } 


        #### UTILS








export const newSubformsData = (from, to) => {
  const toIds =
    to?.reduce((acc, object) => {
      return [...acc, object.unique_id];
    }, []) || [];

  const fromIds =
    from?.reduce((acc, object) => {
      return [...acc, object.unique_id];
    }, []) || [];

  const newForms = difference(toIds, fromIds);
  const deletedForms = difference(fromIds, toIds);
  const updated = intersection(toIds, fromIds);

  return compareArray(to, from);
};
