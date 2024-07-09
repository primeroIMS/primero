// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { fromJS } from "immutable";

import { useI18n } from "../../../../../i18n";
import InternalAlert, { SEVERITY } from "../../../../../internal-alert";

function Component({ maximumUsers, totalUsersEnabled, limitUsersReached }) {
  const i18n = useI18n();
  const itemsForAlert = fromJS([
    {
      message: i18n.t("users.alerts.total_users_created", {
        total_enabled: totalUsersEnabled,
        maximum_users: maximumUsers
      })
    }
  ]);

  if (!limitUsersReached) {
    return null;
  }

  return <InternalAlert items={itemsForAlert} severity={SEVERITY.info} data-testid="internal-alert" />;
}

Component.displayName = "AlertMaxUser";

Component.propTypes = {
  limitUsersReached: PropTypes.bool,
  maximumUsers: PropTypes.number,
  totalUsersEnabled: PropTypes.number
};

export default Component;
