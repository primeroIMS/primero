// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { batch } from "react-redux";

export default (data, dispatch, fetch, setFilters) => {
  const filters = { data };

  batch(() => {
    dispatch(fetch(filters));
    dispatch(setFilters(filters));
  });
};
