// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Set } from "immutable";

export default (...keys) => {
  const keySet = Set(keys);

  return (v, k) => keySet.has(k);
};
