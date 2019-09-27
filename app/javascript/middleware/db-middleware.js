const dbMiddleware = store => next => action => {
  console.log({ store, next, action });

  //
  // switch (action.type) {
  //   case "OFFLINE_GET_RECORDS":
  //     // get records from indexeddb
  //     //  cases/RECORDS_SUCCESS {data: [], metadata: {total, per, page}}
  // }

  next(action);
};

export default dbMiddleware;
