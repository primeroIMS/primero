// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (headers, i18n) =>
  headers.map(({ name, field_name: fieldName }) => ({
    label: i18n.t(name),
    name: fieldName
  }));
