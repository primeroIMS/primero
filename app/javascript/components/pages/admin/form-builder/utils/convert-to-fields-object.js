// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default fields =>
  fields?.map(field => ({ [field.name]: field })).reduce((acc, value) => ({ ...acc, ...value }), {});
