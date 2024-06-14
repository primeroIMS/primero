// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import head from "lodash/head";
import uniqBy from "lodash/uniqBy";

import { METHODS } from "../../config";
import DB from "../../db/db";
import { SNACKBAR_VARIANTS } from "../../components/notifier/constants";
import { SET_ATTACHMENT_STATUS } from "../../components/records/actions";
import { setQueueData } from "../../components/connectivity/action-creators";
import transformOfflineRequest from "../transform-offline-request";
import EventManager from "../messenger";
import { queueIndexedDB } from "../../db";
import { ENQUEUE_SNACKBAR } from "../../components/notifier/actions";

import {
  deleteFromQueue,
  messageQueueFailed,
  messageQueueSkip,
  messageQueueSuccess,
  sortQueueByDeleteFirst
} from "./utils";
import {
  QUEUE_PENDING,
  QUEUE_READY,
  QUEUE_HALTED,
  QUEUE_ADD,
  QUEUE_FINISHED,
  QUEUE_FAILED,
  QUEUE_SKIP,
  QUEUE_SUCCESS,
  QUEUE_ALLOWED_RETRIES
} from "./constants";

class Queue {
  constructor() {
    this.queue = [];
    this.success = {};
    this.tries = 0;
    this.working = false;
    this.force = false;

    EventManager.subscribe(QUEUE_ADD, action => {
      this.add(action);
    });

    EventManager.subscribe(QUEUE_SKIP, () => {
      this.tries = 0;
      this.queue.shift();

      if (!this.working) this.process();
    });

    EventManager.subscribe(QUEUE_SUCCESS, action => {
      if (
        action?.api?.method &&
        action?.api?.method !== METHODS.GET &&
        !["SAVE_ATTACHMENT", "DELETE_ATTACHMENT"].some(type => action.type.endsWith(type))
      ) {
        this.success = {
          ...this.success,
          [action?.api?.id || action?.api?.body?.data?.id]: true
        };
      }

      this.queue = this.queue.filter(current => current.fromQueue !== action.fromQueue);

      this.dispatch(setQueueData(this.queue));

      if (!this.hasWork()) {
        this.notifySuccess();
      }

      this.onAttachmentSuccess(action);

      if (!this.working) this.process();
    });

    EventManager.subscribe(QUEUE_FAILED, id => {
      const handleFailed = async () => {
        const action = await queueIndexedDB.failed(id);

        const queueFiltered = this.queue.filter(current => current.fromQueue !== id);

        if (action && action.tries < QUEUE_ALLOWED_RETRIES) {
          action.processed = false;
          this.queue = [...queueFiltered, action];
        } else {
          this.queue = queueFiltered;
          this.onAttachmentError(action);
        }

        if (!this.hasWork()) {
          this.notifySuccess();
        }

        this.force = false;

        if (!this.working) this.process();
      };

      handleFailed();
    });

    EventManager.subscribe(QUEUE_FINISHED, id => {
      this.finished(id);
    });

    this.fromDB();

    return Queue.instance;
  }

  async fromDB() {
    const offlineRequests = (await DB.getAll("offline_requests")) || [];

    this.add(uniqBy(offlineRequests, "fromQueue"));
  }

  start() {
    if (!this.working) this.process();
  }

  add(actions) {
    this.queue = uniqBy(this.queue.concat(actions), "fromQueue");

    if (!this.working) {
      this.process();
    }
  }

  finished(id) {
    this.queue = this.queue.filter(current => current.fromQueue !== id);

    this.dispatch(setQueueData(this.queue));

    if (!this.working) this.process();
  }

  async triggerProcess() {
    this.force = true;
    await this.fromDB();
    this.dispatch(setQueueData(this.queue));
    this.process(true);
  }

  process() {
    if (this.ready) {
      this.working = true;

      const item = head(sortQueueByDeleteFirst(this.queue));

      if (item && !item?.processed && ((item.tries || 0) < QUEUE_ALLOWED_RETRIES || this.force)) {
        this.onAttachmentProcess(item);

        const action = item;

        const self = this;

        transformOfflineRequest(action).then(transformed => {
          self.dispatch(transformed);
        });

        item.processed = true;
      }

      this.working = false;
    }
  }

  onAttachment(action, payload) {
    if (action && action?.type?.includes("ATTACHMENT")) {
      const { field_name: fieldName, record_type: recordType } = action.fromAttachment;
      const pending = this.hasAttachments(recordType, fieldName);

      this.dispatch({
        type: `${action.fromAttachment.record_type}/${SET_ATTACHMENT_STATUS}`,
        payload: { ...payload, pending, fieldName }
      });
    }
  }

  onAttachmentProcess(action) {
    this.onAttachment(action, { processing: true, error: false });
  }

  onAttachmentSuccess(action) {
    this.onAttachment(action, { processing: false, error: false });
  }

  onAttachmentError(action) {
    this.onAttachment(action, { processing: false, error: true });
  }

  notifySuccess() {
    const syncedRecords = Object.keys(this.success).length;

    if (syncedRecords) {
      this.dispatch({
        type: ENQUEUE_SNACKBAR,
        payload: {
          messageKey: "sync.success",
          messageParams: { records: syncedRecords },
          options: {
            variant: SNACKBAR_VARIANTS.success,
            key: "sync_success"
          }
        }
      });
    }

    this.success = {};
  }

  hasAttachments(recordType, fieldName) {
    return this.queue.some(
      current =>
        current.type.includes("ATTACHMENT") &&
        current.fromAttachment.record_type === recordType &&
        current.fromAttachment.field_name === fieldName
    );
  }

  hasWork() {
    return Boolean(this.queue.length);
  }
}

const instance = new Queue();

export default instance;

export { QUEUE_PENDING, QUEUE_READY, QUEUE_HALTED, QUEUE_ADD, QUEUE_FINISHED, QUEUE_FAILED, QUEUE_SKIP, QUEUE_SUCCESS };

export { deleteFromQueue, messageQueueFailed, messageQueueSkip, messageQueueSuccess };
