import head from "lodash/head";

import DB from "../db";

import EventManager from "./messenger";

const QUEUE_ADD = "queue-add";
const QUEUE_FINISHED = "queue-finished";
const QUEUE_FAILED = "queue-failed";

class Queue {
  constructor() {
    this.queue = [];
    this.working = false;

    EventManager.subscribe(QUEUE_ADD, action => {
      this.add(action);
    });

    EventManager.subscribe(QUEUE_FAILED, () => {
      this.queue[0][1] = this.queue[0][1] + 1;
      this.queue.push(this.queue.shift());

      if (!this.working) this.process();
    });

    EventManager.subscribe(QUEUE_FINISHED, id => {
      this.finished(id);
    });

    this.fromDB();

    return Queue.instance;
  }

  async fromDB() {
    const offlineRequests =
      (await (await DB.getAll("offline_requests")).map(item => [item, 0])) ||
      [];

    this.add(offlineRequests);
  }

  start() {
    if (!this.working) this.process();
  }

  add(actions) {
    this.queue.push(...(Array.isArray(actions) ? actions : [[actions, 0]]));

    if (!this.working.process) {
      this.process();
    }
  }

  finished() {
    this.queue.shift();

    if (!this.working) this.process();
  }

  process() {
    if (this.online) {
      this.working = true;

      const item = head(this.queue);

      if (item) {
        const [action, retries] = item;

        if (retries < 2) {
          this.dispatch(action);
        } else {
          this.queue.shift();
          this.process();
        }
      }

      this.working = false;
    }
  }
}

const instance = new Queue();

export default instance;

export { QUEUE_ADD, QUEUE_FINISHED, QUEUE_FAILED };
