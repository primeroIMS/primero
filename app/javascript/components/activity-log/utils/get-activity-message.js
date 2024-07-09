// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { TYPES } from "../constants";

export default (activity, i18n) => {
  const { type, displayId, recordType, data } = activity;

  if (type === TYPES.transfer) {
    return i18n.t(`activity_log.${data.status.to}_transfer`, {
      to: data.owned_by.to,
      from: data.owned_by.from,
      record_type: i18n.t(`forms.record_types.${recordType}`),
      record_id: displayId.toUpperCase()
    });
  }

  return null;
};
