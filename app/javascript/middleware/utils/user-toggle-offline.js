// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default store => {
  return store.getState().getIn(["connectivity", "fieldMode"], false);
};
