import uuid from "uuid";

import { RECORD_PATH, METHODS } from "../../config";

const generateName = (body = {}) => {
  const { name_first: nameFirst, name_last: nameLast, name } = body;

  if (name) {
    return { name };
  }

  return nameFirst || nameLast ? { name: `${nameFirst} ${nameLast}` } : {};
};

export default (store, api, isRecord) => {
  const { subform = false, id, body, method, recordType } = api;
  const username = store.getState().getIn(["user", "username"], "false");
  const generatedID = uuid.v4();
  const shortID = generatedID.substr(generatedID.length - 7);
  const recordBody = body?.data || body;

  return {
    ...(isRecord && { id }),
    ...(method === METHODS.POST && {
      // eslint-disable-next-line camelcase
      ...(subform && !recordBody?.unique_id && { unique_id: generatedID }),
      ...(!id &&
        isRecord && {
          id: generatedID,
          short_id: shortID,
          record_in_scope: true,
          enabled: true,
          ...(recordType === RECORD_PATH.cases && {
            workflow: "new"
          })
        }),
      // eslint-disable-next-line camelcase
      ...(!recordBody?.owned_by && isRecord && { owned_by: username }),
      ...(!recordBody?.type && isRecord && { type: recordType }),
      // eslint-disable-next-line camelcase
      ...(!recordBody?.created_at && isRecord && { created_at: new Date() })
    }),
    ...(isRecord && generateName(recordBody))
  };
};
