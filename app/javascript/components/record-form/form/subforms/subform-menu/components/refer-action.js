import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { MenuItem } from "@material-ui/core";

import { useI18n } from "../../../../../i18n";

const ReferAction = ({ index, handleReferral, values }, ref) => {
  const i18n = useI18n();

  return (
    <MenuItem
      key={`refer-option-${index}`}
      onClick={() => handleReferral()}
      ref={ref}
    >
      {values[index].service_status_referred
        ? i18n.t("buttons.referral_again")
        : i18n.t("buttons.referral")}
    </MenuItem>
  );
};

ReferAction.displayName = "ReferAction";

ReferAction.propTypes = {
  handleReferral: PropTypes.func,
  index: PropTypes.number,
  values: PropTypes.object
};

export default forwardRef(ReferAction);
