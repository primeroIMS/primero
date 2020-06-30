import React from "react";
import { fromJS } from "immutable";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions } from "../../../user";
import NAMESPACE from "../namespace";
import { CREATE_RECORDS } from "../../../../libs/permissions";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import { fetchUsers } from "./action-creators";
import { LIST_HEADERS } from "./constants";

const Container = () => {
  const i18n = useI18n();
  const canAddUsers = usePermissions(NAMESPACE, CREATE_RECORDS);
  const recordType = "users";

  const columns = LIST_HEADERS.map(({ label, ...rest }) => ({
    label: i18n.t(label),
    ...rest
  }));

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters: fromJS({
      per: 20,
      page: 1
    }),
    onTableChange: fetchUsers
  };

  const newUserBtn = canAddUsers && (
    <ActionButton
      icon={<AddIcon />}
      text={i18n.t("buttons.new")}
      type={ACTION_BUTTON_TYPES.default}
      rest={{
        to: ROUTES.admin_users_new,
        component: Link
      }}
    />
  );

  return (
    <>
      <PageHeading title={i18n.t("users.label")}>{newUserBtn}</PageHeading>
      <PageContent>
        <IndexTable {...tableOptions} />
      </PageContent>
    </>
  );
};

Container.displayName = "UsersList";

Container.propTypes = {};

export default Container;
