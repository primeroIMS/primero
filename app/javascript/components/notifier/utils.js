// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

import kebabCase from "lodash/kebabCase";

import uuid from "../../libs/uuid";

export const generate = {
  messageKey: (message, isMessageKey) => {
    if (message) {
      return isMessageKey ? message : kebabCase(message);
    }

    return uuid.v4().substr(-12);
  }
};
