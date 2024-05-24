// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default data => {
  const source = { ...data };

  delete source.selected_locale_id;

  return source;
};
