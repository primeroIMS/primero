// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { batch } from "react-redux";

export default (data, dispatch, fetchFn, setFilters) => {
  const filters = { data };

  batch(() => {
    dispatch(fetchFn(filters));
    dispatch(setFilters(filters));
  });
};
