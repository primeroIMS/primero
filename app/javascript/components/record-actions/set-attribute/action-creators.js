// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { RECORD_PATH } from "../../../config";
import Actions from "../../record-form/actions";

export const fetchUsersIdentified = params => {
  const { data } = params || {};

  return {
    type: Actions.FETCH_USERS_IDENTIFIED,
    api: {
      path: `${RECORD_PATH.users}/identified`,
      params: { ...data, page: 1, per: 20 }
    }
  };
};
