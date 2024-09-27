// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { DATE_TIME_FORMAT } from "../../../../config";

import { SYNC_RECORD_STATUS } from "./constants";

export const removeEmptyArrays = object =>
  Object.entries(object)
    .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : true))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

export const buildLabelSync = (syncedStatus, syncedAt, i18n) => {
  const lastDate = syncedAt ? i18n.localizeDate(syncedAt, DATE_TIME_FORMAT) : "--";

  switch (syncedStatus) {
    case SYNC_RECORD_STATUS.failed:
      return i18n.t("sync_record.failed");
    case SYNC_RECORD_STATUS.not_found:
      return i18n.t("sync_record.not_found");
    case SYNC_RECORD_STATUS.sending:
    case SYNC_RECORD_STATUS.sent:
      return i18n.t("sync_record.retrieving");
    default:
      return i18n.t(`sync_record.last`, { date_time: lastDate });
  }
};

export function buildErrorOutput(formErrors, field, locale) {
  const fieldError = formErrors[field.get("name")];

  if (Array.isArray(fieldError)) {
    if (fieldError.every(error => typeof error === "object")) {
      return formErrors[field.get("name")]
        .map((error, index) => `(${index + 1}) ${field.getIn(["display_name", locale])}: ${Object.values(error)}`)
        .join("\n");
    }

    return fieldError.join("");
  }

  return fieldError;
}
