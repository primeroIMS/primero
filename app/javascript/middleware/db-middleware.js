/* eslint-disable */
const dbMiddleware = store => next => action => {
  // TODO: Middleware will handle fetching offline data from indexeddb for pwa;
  next(action);
};

export default dbMiddleware;
