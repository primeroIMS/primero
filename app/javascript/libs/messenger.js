class EventManager {
  constructor() {
    this.events = {};

    return EventManager.instance;
  }

  publish(name, data) {
    const handlers = this.events[name];

    if (!!handlers === false) return;

    handlers.forEach(handler => {
      handler.call(this, data);
    });
  }

  subscribe(name, handler) {
    let handlers = this.events[name];

    if (!!handlers === false) {
      // eslint-disable-next-line no-multi-assign
      handlers = this.events[name] = [];
    }

    handlers.push(handler);
  }

  unsubscribe(name, handler) {
    const handlers = this.events[name];

    if (!!handlers === false) return;

    const handlerIdx = handlers.indexOf(handler);

    handlers.splice(handlerIdx);
  }
}

const instance = new EventManager();

Object.freeze(instance);

export default instance;
