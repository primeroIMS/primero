import { fetchForms, fetchOptions } from "components/record-form";
import { batch } from "react-redux";

export const loadApplicationResources = () => async dispatch => {
  batch(() => {
    dispatch(fetchForms());
    dispatch(fetchOptions());
  });
};
