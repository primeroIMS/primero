// Copyright (c) 2014 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../../../i18n";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../action-button";

import { AUDIT_LOGS_PATHS } from "./constants";
import css from "./styles.css";
import { getRecordID } from "./utils";

function Component({ value, rowIndex, data }) {
  const i18n = useI18n();
  const prefix = value?.prefix?.approval_type
    ? i18n.t(value?.prefix?.key, { approval_label: i18n.t(`cases.${value?.prefix?.approval_type}`) })
    : i18n.t(value?.prefix?.key);
  const recordID = getRecordID(data.getIn(["data", rowIndex]));
  const currentRecordType = data.getIn(["data", rowIndex, "record_type"]);
  const resourceLabel = i18n.t(`logger.resources.${currentRecordType}`);

  if (!isEmpty(recordID)) {
    return (
      <div className={css.message}>
        <span>{`${prefix}`}</span>
        <ActionButton
          text={`${resourceLabel} ${recordID}`}
          type={ACTION_BUTTON_TYPES.link}
          noTranslate
          href={`/v2${AUDIT_LOGS_PATHS[currentRecordType]}/${recordID}`}
        />
      </div>
    );
  }

  return <span>{`${prefix} ${i18n.t(`logger.resources.${currentRecordType}`)}`}</span>;
}

Component.displayName = "LogDescriptionMessage";

Component.propTypes = {
  data: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  value: PropTypes.object.isRequired
};

export default Component;
