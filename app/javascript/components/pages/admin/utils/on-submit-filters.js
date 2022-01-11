import { batch } from "react-redux";

export default (data, dispatch, fetch, setFilters) => {
  const filters = { data };

  batch(() => {
    dispatch(fetch(filters));
    dispatch(setFilters(filters));
  });
};
