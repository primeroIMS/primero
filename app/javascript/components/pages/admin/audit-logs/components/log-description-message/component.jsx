// Copyright (c) 2014 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { NavLink } from "react-router-dom";

import { useI18n } from "../../../../../i18n";

import { AUDIT_LOGS_PATHS } from "./constants";
import css from "./styles.css";
import { getRecordValue } from "./utils";

function Component({ value, rowIndex, data }) {
  const i18n = useI18n();
  const prefix = value?.prefix?.approval_type
    ? i18n.t(value?.prefix?.key, { approval_label: i18n.t(`cases.${value?.prefix?.approval_type}`) })
    : i18n.t(value?.prefix?.key);
  const recordID = getRecordValue(data.getIn(["data", rowIndex]), "record_id");
  const recordDisplayName = getRecordValue(data.getIn(["data", rowIndex]), "display_name");
  const currentRecordType = data.getIn(["data", rowIndex, "record_type"]);
  const resourceLabel =
    currentRecordType === "managed_report" && !isEmpty(recordID)
      ? `${i18n.t(`logger.resources.${currentRecordType}`)} - ${i18n.t(`managed_reports.${recordID}.name`)}`
      : i18n.t(`logger.resources.${currentRecordType}`);

  if (!isEmpty(recordID) && currentRecordType !== "managed_report") {
    return (
      <div className={css.message}>
        <span>{`${prefix}`}</span>
        <NavLink
          to={`${AUDIT_LOGS_PATHS[currentRecordType]}/${recordID}`}
          className={css.link}
        >{`${resourceLabel} ${recordDisplayName}`}</NavLink>
      </div>
    );
  }

  return <span>{`${prefix} ${resourceLabel}`}</span>;
}

Component.displayName = "LogDescriptionMessage";

Component.propTypes = {
  data: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  value: PropTypes.object.isRequired
};

export default Component;
