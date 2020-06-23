import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { fromJS } from "immutable";

import { useI18n } from "../i18n";
import InternalAlert from "../internal-alert";
import { compare } from "../../libs";
import { getRecordFormAlerts } from "../records";

import { getMessageData } from "./utils";
import { NAME } from "./constants";

const Component = ({ form, recordType }) => {
  const i18n = useI18n();
  const recordAlerts = useSelector(
    state => getRecordFormAlerts(state, recordType, form.unique_id),
    compare
  );

  const items = recordAlerts.map(alert =>
    fromJS({
      message: i18n.t(
        `messages.alerts_for.${alert.get("alert_for")}`,
        getMessageData({ alert, form, i18n })
      )
    })
  );

  return items?.size ? <InternalAlert items={fromJS(items)} /> : null;
};

Component.displayName = NAME;

Component.propTypes = {
  form: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired
};

export default Component;
