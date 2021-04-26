import PropTypes from "prop-types";

import { useI18n } from "../../i18n";

const DateCell = ({ value, withTime }) => {
  const i18n = useI18n();

  return <>{i18n.l(`date.formats.${withTime ? "with_time" : "default"}`, value)}</>;
};

DateCell.displayName = "DateCell";

DateCell.propTypes = {
  value: PropTypes.string,
  withTime: PropTypes.bool
};

export default DateCell;
