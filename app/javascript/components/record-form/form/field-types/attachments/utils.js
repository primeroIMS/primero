/* eslint-disable import/prefer-default-export */

import { ATTACHMENT_FIELDS } from "./constants";

export const buildAttachmentFieldsObject = (name, index) =>
  Object.keys(ATTACHMENT_FIELDS).reduce((current, prev) => {
    const obj = current;

    obj[prev] = `${name}[${index}][${ATTACHMENT_FIELDS[prev]}]`;

    return obj;
  }, {});

export const buildBase64URL = (contentType, data) => `data:${contentType};base64,${data}`;
