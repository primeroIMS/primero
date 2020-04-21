import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { MenuItem } from "@material-ui/core";

import Permission from "../../../../../application/permission";
import {
  RESOURCES,
  REFER_FROM_SERVICE
} from "../../../../../../libs/permissions";
import { useI18n } from "../../../../../i18n";

const ReferAction = ({ index, handleReferral, values }, ref) => {
  const i18n = useI18n();

  return (
    <Permission resources={RESOURCES.cases} actions={REFER_FROM_SERVICE}>
      <MenuItem
        key={`refer-option-${index}`}
        onClick={() => handleReferral()}
        ref={ref}
      >
        {values[index].service_status_referred
          ? i18n.t("buttons.referral_again")
          : i18n.t("buttons.referral")}
      </MenuItem>
    </Permission>
  );
};

ReferAction.displayName = "ReferAction";

ReferAction.propTypes = {
  handleReferral: PropTypes.func,
  index: PropTypes.number,
  values: PropTypes.object
};

export default forwardRef(ReferAction);
