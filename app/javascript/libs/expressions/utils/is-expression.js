// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isOperator from "./is-operator";

export default expression => {
  if (Array.isArray(expression)) {
    return false;
  }

  const keys = Object.keys(expression);

  return keys.length === 1 && keys.every(key => isOperator(key));
};
