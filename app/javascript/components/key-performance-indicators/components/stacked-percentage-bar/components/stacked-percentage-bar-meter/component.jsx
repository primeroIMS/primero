// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

function Component({ realPercent, index, css }) {
  const percentage = realPercent * 100;
  const style = { width: `${percentage}%` };

  return <div key={index} className={css[`StackedPercentageBar${index + 1}Complete`]} style={style} />;
}

Component.displayName = "StackedPercentageBarMeter";

Component.propTypes = {
  css: PropTypes.object,
  index: PropTypes.number,
  realPercent: PropTypes.number
};

export default Component;
