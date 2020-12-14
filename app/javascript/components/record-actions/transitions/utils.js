/* eslint-disable import/prefer-default-export */

import isEmpty from "lodash/isEmpty";

import { USER_NAME_FIELD } from "../../../config";

export const filterUsers = (users, mode, record, excludeOwner = false) => {
  return users
    ? users
        .valueSeq()
        .map(user => {
          const userName = user.get(USER_NAME_FIELD);

          if (excludeOwner && mode.isShow && record && userName === record.get("owned_by")) {
            return {};
          }

          return {
            value: userName.toLowerCase(),
            label: userName
          };
        })
        .filter(user => !isEmpty(user))
        .toJS()
    : [];
};
