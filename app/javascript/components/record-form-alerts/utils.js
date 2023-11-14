// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { format, parseISO } from "date-fns";

import { ALERTS_FOR, DATE_FORMAT } from "../../config";

export const getMessageData = ({ alert, form, duplicatedFields, i18n }) => {
  const alertFor = alert.get("alert_for");

  switch (alertFor) {
    case ALERTS_FOR.field_change:
      return {
        form_section_name: form.getIn(["name", i18n.locale]),
        alert_time: alert.get("date") && format(parseISO(alert.get("date")), DATE_FORMAT)
      };
    case ALERTS_FOR.approval:
      return { form_section_name: form.getIn(["name", i18n.locale]) };
    case ALERTS_FOR.duplicate_field:
      return {
        field_name: duplicatedFields
          .find(field => field.name === alert.get("type"))
          ?.getIn(["display_name", i18n.locale])
      };
    case ALERTS_FOR.transfer:
      return i18n.t(`case.messages.case_transfer_pending`);
    default:
      return {};
  }
};
