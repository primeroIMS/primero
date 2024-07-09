// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

export default data => {
  const resultData = data.reduce(
    (acc, curr) => {
      const indicatorData = curr.get("indicators") || fromJS({});
      const key = indicatorData.keySeq().first();

      if (key) {
        acc.indicators[key] = curr.getIn(["indicators", key]);
      }

      return { ...acc };
    },
    { indicators: {} }
  );

  return fromJS(resultData);
};
