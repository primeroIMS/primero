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

  return {
    ...(isRecord && { id }),
    ...(method === METHODS.POST && {
      // eslint-disable-next-line camelcase
      ...(subform && !body?.unique_id && { unique_id: generatedID }),
      ...(!id &&
        isRecord && {
          id: generatedID,
          short_id: shortID,
          ...(recordType === RECORD_PATH.cases && {
            case_id_display: shortID
          })
        }),
      // eslint-disable-next-line camelcase
      ...(!body?.owned_by && isRecord && { owned_by: username }),
      ...(!body?.type && isRecord && { type: recordType }),
      // eslint-disable-next-line camelcase
      ...(!body?.created_at && isRecord && { created_at: new Date() })
    }),
    ...(isRecord && generateName(body))
  };
};
