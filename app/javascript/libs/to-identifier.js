import uuid from "uuid";
import isEmpty from "lodash/isEmpty";

export default data => {
  const generatedId = data?.replace(/[^\w]/g, "_").toLowerCase();
  const identifier = uuid.v4().substr(-7);

  if (isEmpty(generatedId)) {
    return identifier;
  }

  return `${generatedId}_${identifier}`;
};
