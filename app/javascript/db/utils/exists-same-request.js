import isEqual from "lodash/isEqual";

import { DB_STORES } from "../constants";
import DB from "../db";

export default async action => {
  const offlineRequests = await DB.getAll(DB_STORES.OFFLINE_REQUESTS);

  return offlineRequests.some(request => isEqual(request.api?.body, action.api?.body));
};
