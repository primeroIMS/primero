/* eslint-disable import/prefer-default-export */

export const generate = {
  messageKey: () => {
    return new Date().getTime() + Math.random();
  }
};
