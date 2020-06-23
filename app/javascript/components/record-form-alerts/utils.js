/* eslint-disable import/prefer-default-export */
import { format, parseISO } from "date-fns";

import { ALERTS_FOR, DATE_FORMAT } from "../../config";

export const getMessageData = ({ alert, form, i18n }) => {
  const alertFor = alert.get("alert_for");

  switch (alertFor) {
    case ALERTS_FOR.field_change:
      return {
        form_section_name: form.getIn(["name", i18n.locale]),
        alert_time:
          alert.get("date") && format(parseISO(alert.get("date")), DATE_FORMAT)
      };
    case ALERTS_FOR.approval:
      return { form_section_name: form.getIn(["name", i18n.locale]) };
    default:
      return {};
  }
};
