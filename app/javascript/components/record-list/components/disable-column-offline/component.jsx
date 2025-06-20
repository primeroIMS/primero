// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import isNil from "lodash/isNil";

import { ConditionalWrapper } from "../../../../libs";
import DisableOffline from "../../../disable-offline";
import DateColumn from "../date-column";

function DisableColumnOffline({
  component,
  value,
  withTime,
  rowAvailable,
  type,
  offlineTextKey = "unavailable_offline"
}) {
  const parsedValue = Array.isArray(value) ? value.join(", ") : value;
  const columnValue = isNil(parsedValue) ? "" : parsedValue;

  if (type === "date") {
    return <DateColumn rowAvailable={rowAvailable} wrapper={DisableOffline} value={value} valueWithTime={withTime} />;
  }

  const wrappedContent = <>{component !== undefined ? component : columnValue}</>;

  return (
    <ConditionalWrapper
      condition={!rowAvailable}
      wrapper={DisableOffline}
      offlineTextKey={offlineTextKey}
      overrideCondition={!rowAvailable}
    >
      {wrappedContent}
    </ConditionalWrapper>
  );
}

DisableColumnOffline.displayName = "DisableColumnOffline";

DisableColumnOffline.propTypes = {
  component: PropTypes.node,
  offlineTextKey: PropTypes.string,
  rowAvailable: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.oneOf([PropTypes.array, PropTypes.string, PropTypes.node]),
  withTime: PropTypes.bool
};

export default DisableColumnOffline;
