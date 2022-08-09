import PropTypes from "prop-types";
import clsx from "clsx";

import { DATE_TIME_FORMAT } from "../../../../config";
import { useI18n } from "../../../i18n";
import getActivityMessage from "../../utils/get-activity-message";

import css from "./styles.css";

const Component = ({ activityData }) => {
  const i18n = useI18n();
  const classes = clsx(css.activityContainer, {
    [css.disabledItem]: activityData.recordAccessDenied
  });

  const { datetime, displayId, recordType, type } = activityData;
  const lowerCasedRecordType = recordType?.toLowerCase();
  const upperCasedDisplayId = displayId?.toUpperCase();

  const message = getActivityMessage(
    { ...activityData, displayId: upperCasedDisplayId, recordType: lowerCasedRecordType },
    i18n
  );

  return (
    <div className={classes}>
      <div className={css.activityInfo}>
        <div className={css.recordId}>
          {i18n.t(`forms.record_types.${lowerCasedRecordType}`)} #{upperCasedDisplayId}
        </div>
        <div className={css.date}>{i18n.localizeDate(datetime, DATE_TIME_FORMAT)}</div>
      </div>
      <div className={css.message}>{message}</div>
      <div className={css.type}>{i18n.t(`${type}.label`)}</div>
    </div>
  );
};

Component.displayName = "ActivityItem";

Component.propTypes = {
  activityData: PropTypes.shape({
    data: PropTypes.object,
    datetime: PropTypes.string,
    displayId: PropTypes.string,
    performedBy: PropTypes.string,
    recordAccessDenied: PropTypes.bool,
    recordId: PropTypes.string,
    recordType: PropTypes.string,
    type: PropTypes.string
  })
};

export default Component;
