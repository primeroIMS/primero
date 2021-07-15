import head from "lodash/head";

import { METHODS } from "../../config";
import DB from "../../db/db";
import { ENQUEUE_SNACKBAR, SNACKBAR_VARIANTS } from "../../components/notifier";
import { SET_ATTACHMENT_STATUS } from "../../components/records/actions";
import transformOfflineRequest from "../transform-offline-request";
import EventManager from "../messenger";

import { deleteFromQueue, messageQueueFailed, messageQueueSkip, messageQueueSuccess } from "./utils";
import {
  QUEUE_PENDING,
  QUEUE_READY,
  QUEUE_HALTED,
  QUEUE_ADD,
  QUEUE_FINISHED,
  QUEUE_FAILED,
  QUEUE_SKIP,
  QUEUE_SUCCESS
} from "./constants";

class Queue {
  constructor() {
    this.queue = [];
    this.success = {};
    this.tries = 0;
    this.working = false;

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

      this.queue.shift();

      if (!this.hasWork()) {
        this.notifySuccess();
      }

      this.onAttachmentSuccess(action);

      if (!this.working) this.process();
    });

    EventManager.subscribe(QUEUE_FAILED, () => {
      this.tries += 1;

      const action = head(this.queue);

      if (action) {
        action.processed = false;
      }

      if (this.tries === 3) {
        this.queue.shift();
        this.tries = 0;

        this.onAttachmentError(action);
      }

      if (!this.hasWork()) {
        this.notifySuccess();
      }

      if (!this.working) this.process();
    });

    EventManager.subscribe(QUEUE_FINISHED, id => {
      this.finished(id);
    });

    this.fromDB();

    return Queue.instance;
  }

  async fromDB() {
    const offlineRequests = (await DB.getAll("offline_requests")) || [];

    this.add(offlineRequests);
  }

  start() {
    if (!this.working) this.process();
  }

  add(actions) {
    this.queue = this.queue.concat(actions);

    if (!this.working) {
      this.process();
    }
  }

  finished(id) {
    this.queue = this.queue.filter(current => current.fromQueue !== id);

    if (!this.working) this.process();
  }

  process() {
    if (this.ready) {
      this.working = true;

      const item = head(this.queue);

      if (item && !item?.processed) {
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
