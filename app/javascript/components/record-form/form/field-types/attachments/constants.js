// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export const ATTACHMENT_FIELDS = Object.freeze({
  attachment: "attachment",
  attachmentType: "attachment_type",
  comments: "comments",
  contentType: "content_type",
  date: "date",
  description: "description",
  fieldName: "field_name",
  fileName: "file_name",
  isCurrent: "is_current",
  type: "type"
});

export const ATTACHMENT_FIELDS_INITIAL_VALUES = Object.freeze({
  [ATTACHMENT_FIELDS.attachment]: null,
  [ATTACHMENT_FIELDS.attachmentType]: "",
  [ATTACHMENT_FIELDS.comments]: "",
  [ATTACHMENT_FIELDS.contentType]: "",
  [ATTACHMENT_FIELDS.date]: new Date(),
  [ATTACHMENT_FIELDS.description]: "",
  [ATTACHMENT_FIELDS.fieldName]: "",
  [ATTACHMENT_FIELDS.fileName]: "",
  [ATTACHMENT_FIELDS.isCurrent]: false,
  [ATTACHMENT_FIELDS.type]: ""
});

export const ATTACHMENT_TYPES = Object.freeze({
  document: "document",
  photo: "image",
  audio: "audio"
});

export const FIELD_ATTACHMENT_TYPES = Object.freeze({
  photo_upload_box: ATTACHMENT_TYPES.photo,
  audio_upload_box: ATTACHMENT_TYPES.audio,
  document_upload_box: ATTACHMENT_TYPES.document
});

export const ATTACHMENT_ACCEPTED_TYPES = Object.freeze({
  audio: ".m4a, audio/mpeg, audio/mp4",
  image: "image/png, image/gif, image/jpeg, image/jpg",
  document:
    "application/pdf, text/plain, .csv, text/csv, .doc, .docx, .xlsx, application/msword, " +
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document, " +
    "text/csv application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" +
    "image/jpg, image/jpeg, image/png"
});
