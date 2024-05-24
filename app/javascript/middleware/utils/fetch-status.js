// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default ({ store, type }, action, loading) => {
  store.dispatch({
    type: `${type}_${action}`,
    payload: loading
  });
};
