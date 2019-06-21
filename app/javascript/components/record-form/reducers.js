import { Map, fromJS } from "immutable";

const DEFAULT_STATE = Map({
  selectedForm: 0,
  selectedModule: "",
  formSections: [],
  fields: []
});

export const reducers = namespace => ({
  [namespace]: (state = DEFAULT_STATE, { type, payload }) => {
    switch (type) {
      case `${namespace}/SET_FORMS`:
        return state.set("formSections", fromJS(payload));
      default:
        return state;
    }
  }
});
