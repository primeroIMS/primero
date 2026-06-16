import isEmpty from "lodash/isEmpty";

import uuid from "./uuid";

export default data => {
  const generatedId = data?.replace(/[^\w]/g, "_").toLowerCase();
  const identifier = uuid.v4().substr(-7);

  if (isEmpty(generatedId)) {
    return identifier;
  }

  return `${generatedId}_${identifier}`;
};
