// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { queueIndexedDB } from "../../db";
import EventManager from "../messenger";
import { METHODS } from "../../config";

import { QUEUE_FAILED, QUEUE_SKIP, QUEUE_SUCCESS } from "./constants";

export const deleteFromQueue = async fromQueue => {
  if (fromQueue) {
    await queueIndexedDB.delete(fromQueue);
  }
};

export const messageQueueFailed = fromQueue => {
  if (fromQueue) {
    EventManager.publish(QUEUE_FAILED);
  }
};

export const messageQueueSkip = fromQueue => {
  if (fromQueue) {
    EventManager.publish(QUEUE_SKIP);
  }
};

export const messageQueueSuccess = action => {
  if (action?.fromQueue) {
    EventManager.publish(QUEUE_SUCCESS, action);
  }
};

export const sortQueueByDeleteFirst = queue =>
  queue.sort((elem1, elem2) => {
    if (elem1.api.method === elem2.api.method) {
      return 0;
    }
    if (elem1.api.method === METHODS.DELETE) {
      return -1;
    }
    if (elem2.api.method === METHODS.DELETE) {
      return 1;
    }

    return 0;
  });
