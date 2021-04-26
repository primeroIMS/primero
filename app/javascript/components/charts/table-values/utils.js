import isEmpty from "lodash/isEmpty";

export default name => {
  const randomNumber = Math.floor(Math.random() * 10000 + 1);

  if (isEmpty(name)) {
    return randomNumber;
  }

  return `${randomNumber}-${name}`;
};
