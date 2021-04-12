import uuid from "uuid";
import isEmpty from "lodash/isEmpty";

export default id => {
  const identifier = uuid.v4().substr(-7);

  if (isEmpty(id)) {
    return identifier;
  }

  return `${id}_${identifier}`;
};
