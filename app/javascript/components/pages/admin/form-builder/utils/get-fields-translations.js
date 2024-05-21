// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default fields =>
  Object.keys(fields)
    .map(key => ({ [key]: { display_name: { en: fields[key].display_name?.en } } }))
    .reduce((acc, elem) => ({ ...acc, ...elem }), {});
