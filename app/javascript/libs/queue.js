import head from "lodash/head";

import DB from "../db";

import EventManager from "./messenger";

const QUEUE_ADD = "queue-add";
const QUEUE_FINISHED = "queue-finished";
const QUEUE_FAILED = "queue-failed";
const QUEUE_SKIP = "queue-skip";

class Queue {
  constructor() {
    this.queue = [];
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

    EventManager.subscribe(QUEUE_FAILED, () => {
      this.tries = this.tries + 1;

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
    this.queue.push(...actions);

    if (!this.working.process) {
      this.process();
    }
  }

  finished() {
    this.queue.shift();

    if (!this.working) this.process();
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
}

const instance = new Queue();

export default instance;

export { QUEUE_ADD, QUEUE_FINISHED, QUEUE_FAILED };
