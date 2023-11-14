// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

import { useI18n } from "../../../../../i18n";
import ConditionalTooltip from "../../../../../conditional-tooltip";
import ActionButton from "../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";
import { ROUTES } from "../../../../../../config";

function Component({ canAddUsers, totalUsersEnabled, limitUsersReached }) {
  const i18n = useI18n();
  const tooltipLabel = i18n.t("users.alerts.limit_user_reached", {
    total_enabled: totalUsersEnabled
  });

  if (!canAddUsers) {
    return null;
  }

  return (
    <ConditionalTooltip condition={limitUsersReached} title={tooltipLabel}>
      <ActionButton
        icon={<AddIcon />}
        text="buttons.new"
        type={ACTION_BUTTON_TYPES.default}
        disabled={limitUsersReached}
        data-testid="action-button"
        rest={{
          to: ROUTES.admin_users_new,
          component: Link
        }}
      />
    </ConditionalTooltip>
  );
}

Component.displayName = "NewUserBtn";

Component.propTypes = {
  canAddUsers: PropTypes.bool,
  limitUsersReached: PropTypes.bool,
  totalUsersEnabled: PropTypes.number
};

export default Component;
