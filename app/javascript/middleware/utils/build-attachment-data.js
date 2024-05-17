// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

const buildAttachmentData = action =>
  action.type.includes("ATTACHMENT")
    ? {
        data: {
          id: action?.fromAttachment?.id,
          record: action?.fromAttachment?.record,
          // eslint-disable-next-line camelcase
          field_name: action?.fromAttachment?.field_name
        }
      }
    : {};

export default buildAttachmentData;
