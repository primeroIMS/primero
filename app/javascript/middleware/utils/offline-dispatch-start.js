// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (store, action) => {
  const { type } = action;

  store.dispatch({
    type: `${type}_STARTED`,
    payload: true
  });
};
