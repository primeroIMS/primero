import uuid from "uuid/v4";

import { queueIndexedDB } from "../../db";
import { METHODS } from "../../config";

export default ({ attachments, id, recordType }) => {
  const actions = Object.keys(attachments).reduce((prev, current) => {
    attachments[current].forEach(attachment => {
      const method = attachment?._destroy ? METHODS.DELETE : METHODS.POST;
      const isDelete = method === "DELETE";

      const path = `${recordType}/${id}/attachments${
        isDelete ? `/${attachment?._destroy}` : ""
      }`;

      const action = isDelete ? "DELETE_ATTACHMENT" : "SAVE_ATTACHMENT";

      // eslint-disable-next-line camelcase
      if (!attachment?.attachment_url) {
        prev.push({
          type: `${recordType}/${action}`,
          api: {
            path,
            method,
            ...(!isDelete && {
              body: { data: { ...attachment, field_name: current } }
            })
          },
          fromQueue: uuid()
        });
      }
    });

    return prev;
  }, []);

  if (actions) {
    actions.forEach(action => queueIndexedDB.add(action));
  }
};
