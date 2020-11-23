import head from "lodash/head";

import { METHODS } from "../config";
import DB from "../db/db";
import { ENQUEUE_SNACKBAR, SNACKBAR_VARIANTS } from "../components/notifier";

import EventManager from "./messenger";

const QUEUE_ADD = "queue-add";
const QUEUE_FINISHED = "queue-finished";
const QUEUE_FAILED = "queue-failed";
const QUEUE_SKIP = "queue-skip";
const QUEUE_SUCCESS = "queue-success";

const QUEUE_PENDING = "pending";
const QUEUE_READY = "ready";
const QUEUE_HALTED = "halted";

class Queue {
  constructor() {
    this.queue = [];
    this.success = {};
    this.tries = 0;
    this.working = false;

    EventManager.subscribe(QUEUE_ADD, action => {
      this.add([action]);
    });

    EventManager.subscribe(QUEUE_SKIP, () => {
      this.tries = 0;
      this.queue.shift();

      if (!this.working) this.process();
    });

    EventManager.subscribe(QUEUE_SUCCESS, action => {
      if (action?.api?.method && action?.api?.method !== METHODS.GET) {
        this.success = { ...this.success, [action.api?.data?.id]: true };
        this.queue.shift();

        if (!this.working) this.process();
      }
    });

    EventManager.subscribe(QUEUE_FAILED, () => {
      this.tries += 1;

      if (this.tries === 3) {
        this.queue.shift();
        this.tries = 0;
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

  finished() {
    this.queue.shift();

    if (!this.working) this.process();

    if (!this.queue.length) {
      this.notifySuccess();
      this.success = {};
    }
  }

  process() {
    if (this.ready) {
      this.working = true;

      const item = head(this.queue);

      if (item) {
        const action = item;

        this.dispatch(action);
      }

      this.working = false;
    }
  }

  notifySuccess() {
    if (this.success) {
      this.dispatch({
        type: ENQUEUE_SNACKBAR,
        payload: {
          messageKey: "sync.success",
          messageParams: { records: Object.keys(this.success).length },
          options: {
            variant: SNACKBAR_VARIANTS.success,
            key: "sync_success"
          }
        }
      });
    }
  }

  hasWork() {
    return Boolean(this.queue.length);
  }
}

const instance = new Queue();

export default instance;

export { QUEUE_PENDING, QUEUE_READY, QUEUE_HALTED, QUEUE_ADD, QUEUE_FINISHED, QUEUE_FAILED, QUEUE_SKIP, QUEUE_SUCCESS };
