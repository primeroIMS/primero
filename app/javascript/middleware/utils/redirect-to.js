// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { push } from "connected-react-router";

export default (store, path) => {
  return store.dispatch(push(path));
};
