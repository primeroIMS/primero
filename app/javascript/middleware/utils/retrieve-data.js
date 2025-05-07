// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import syncIndexedDB from "../../db/sync";
import { METHODS } from "../../db";

import offlineDispatchStart from "./offline-dispatch-start";
import offlineDispatchSuccess from "./offline-dispatch-success";

export default async (store, action = {}) => {
  const { api, type } = action;

  try {
    offlineDispatchStart(store, action);

    const payloadFromDB = await syncIndexedDB(api?.db, action, METHODS.READ);

    offlineDispatchSuccess(store, action, payloadFromDB);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error, type);
  }
};
