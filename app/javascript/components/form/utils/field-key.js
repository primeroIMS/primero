// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (name, id) => {
  if (id) {
    return `${name}-${id}`;
  }

  return name;
};
