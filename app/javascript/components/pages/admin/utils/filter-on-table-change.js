export default (dispatch, fetch, setFilters) => filters => {
  const filtersData = { data: filters.data };

  dispatch(setFilters(filtersData));

  return fetch(filtersData);
};
