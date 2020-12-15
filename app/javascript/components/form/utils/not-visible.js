/* eslint-disable import/prefer-default-export */

export const notVisible = condition => {
  return typeof condition === "boolean" && !condition;
};
