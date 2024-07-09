// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (dispatch, fetch, setFilters) => filters => {
  const filtersData = { data: filters.data };

  dispatch(setFilters(filtersData));

  return fetch(filtersData);
};
