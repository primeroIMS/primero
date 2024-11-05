// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

const SEARCH_ID_PARAMS = ["order", "order_by", "id_search"];

export default data => {
  if (data.phonetic === "true") {
    return Object.entries(data).reduce(
      (acc, [key, elem]) => (SEARCH_ID_PARAMS.includes(key) ? acc : { ...acc, [key]: elem }),
      {}
    );
  }

  return data;
};
