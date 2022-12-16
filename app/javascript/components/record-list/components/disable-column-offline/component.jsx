import PropTypes from "prop-types";
import isNil from "lodash/isNil";

import { ConditionalWrapper } from "../../../../libs";
import DisableOffline from "../../../disable-offline";
import DateColumn from "../date-column";

function DisableColumnOffline({ component, value, withTime, rowAvailable, type }) {
  const parsedValue = Array.isArray(value) ? value.join(", ") : value;
  const columnValue = isNil(parsedValue) ? "" : parsedValue;

  if (type === "date") {
    return <DateColumn rowAvailable={rowAvailable} wrapper={DisableOffline} value={value} valueWithTime={withTime} />;
  }

  return (
    <ConditionalWrapper
      condition={!rowAvailable}
      wrapper={DisableOffline}
      offlineTextKey="unavailable_offline"
      overrideCondition={!rowAvailable}
    >
      <>{component !== undefined ? component : columnValue}</>
    </ConditionalWrapper>
  );
}

DisableColumnOffline.displayName = "DisableColumnOffline";

DisableColumnOffline.propTypes = {
  component: PropTypes.node,
  rowAvailable: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.oneOf([PropTypes.array, PropTypes.string, PropTypes.node]),
  withTime: PropTypes.bool
};

export default DisableColumnOffline;
