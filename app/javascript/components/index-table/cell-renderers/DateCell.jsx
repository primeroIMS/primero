import React from "react";
import PropTypes from "prop-types";

import { useI18n } from "../../i18n";

const DateCell = ({ value }) => {
  const i18n = useI18n();

  return <>{i18n.l("date.formats.default", value)}</>;
};

DateCell.propTypes = {
  value: PropTypes.string
};

export default DateCell;
