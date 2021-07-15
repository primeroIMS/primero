import { queueIndexedDB } from "../../db";
import EventManager from "../../libs/messenger";
import { QUEUE_FAILED, QUEUE_SKIP, QUEUE_SUCCESS } from "../../libs/queue";

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

export const deleteFromQueue = async fromQueue => {
  if (fromQueue) {
    await queueIndexedDB.delete(fromQueue);
  }
};
