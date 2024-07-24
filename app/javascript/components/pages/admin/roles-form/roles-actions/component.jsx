// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import Menu from "../../../../menu";
import { useI18n } from "../../../../i18n";
import { setCopyRole } from "../action-creators";
import { ROUTES } from "../../../../../config";

import { NAME } from "./constants";

function Component({ canCopyRole = false, initialValues }) {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const actions = [
    {
      name: i18n.t("permissions.permission.copy"),
      action: () => {
        const copyRole = {
          ...initialValues,
          name: `${i18n.t("permissions.permission.copy_of")} ${initialValues.name}`
        };

        dispatch(setCopyRole(copyRole));
        dispatch(push(ROUTES.admin_roles_new));
      }
    }
  ];

  if (!canCopyRole) {
    return null;
  }

  return (
    <>
      <Menu showMenu actions={actions} />
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  canCopyRole: PropTypes.bool,
  initialValues: PropTypes.object
};

export default Component;
