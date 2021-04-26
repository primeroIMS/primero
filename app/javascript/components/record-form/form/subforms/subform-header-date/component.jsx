import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../../i18n";
import { SUBFORM_HEADER_DATE } from "../constants";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "../../../../../config";

const Component = ({ value, includeTime }) => {
  const i18n = useI18n();

  if (isEmpty(value)) return value || "";

  const dateFormat = includeTime ? DATE_TIME_FORMAT : DATE_FORMAT;
  const dateValue = i18n.localizeDate(value, dateFormat);

  return <span>{dateValue}</span>;
};

Component.displayName = SUBFORM_HEADER_DATE;

Component.propTypes = {
  includeTime: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
};

export default Component;
