import actions from "./actions";

export const fetchForms = () => ({
  type: actions.RECORD_FORMS,
  api: {
    path: "forms",
    normalizeFunc: "normalizeFormData"
  }
});

// TODO: Awaiting batch patch endpoint
// export const saveForms = body => ({
//   type: actions.RECORD_FORMS,
//   api: {
//     path: "forms",
//     method: "PATCH",
//     body
//   }
// });
