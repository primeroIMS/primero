import { queueIndexedDB } from "../../db";
import EventManager from "../messenger";

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
