// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../../../../../i18n";

import css from "./styles.css";

function Component({ displayData, maximumUsers, totalUsersEnabled, limitUsersReached }) {
  const i18n = useI18n();

  if (limitUsersReached || !maximumUsers || !totalUsersEnabled || !displayData?.length) {
    return null;
  }

  return (
    <div className={css.userIndexTableAlert}>
      <span>
        {i18n.t("users.alerts.total_users_created", {
          total_enabled: totalUsersEnabled,
          maximum_users: maximumUsers
        })}
      </span>
    </div>
  );
}

Component.displayName = "CustomToolbar";

Component.propTypes = {
  displayData: PropTypes.array,
  limitUsersReached: PropTypes.bool,
  maximumUsers: PropTypes.number,
  totalUsersEnabled: PropTypes.number
};

export default Component;
