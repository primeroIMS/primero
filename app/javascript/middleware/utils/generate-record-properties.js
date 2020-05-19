import uuid from "uuid";

import { RECORD_PATH } from "../../config";

const generateName = (body = {}) => {
  const { name_first: nameFirst, name_last: nameLast, name } = body;

  if (name) {
    return { name };
  }

  return nameFirst || nameLast ? { name: `${nameFirst} ${nameLast}` } : {};
};

export default (store, api, recordType, isRecord, subform) => {
  const username = store.getState().getIn(["user", "username"], "false");
  const id = uuid.v4();
  const shortID = id.substr(id.length - 7);

  return {
    // eslint-disable-next-line camelcase
    ...(subform && !api?.body?.unique_id && { unique_id: id }),
    ...(!api?.id &&
      isRecord && {
        id,
        short_id: shortID,
        ...(api?.db?.recordType === RECORD_PATH.cases && {
          case_id_display: shortID
        })
      }),
    // eslint-disable-next-line camelcase
    ...(!api?.body?.owned_by && isRecord && { owned_by: username }),
    ...(!api?.body?.type && isRecord && { type: recordType }),
    // eslint-disable-next-line camelcase
    ...(!api?.body?.created_at && isRecord && { created_at: new Date() }),
    ...(isRecord && generateName(api?.body))
  };
};
