// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default fieldData => {
  // eslint-disable-next-line camelcase
  if (fieldData?.hide_on_view_page !== undefined) {
    return {
      ...fieldData,
      hide_on_view_page: !fieldData.hide_on_view_page
    };
  }

  return fieldData;
};
