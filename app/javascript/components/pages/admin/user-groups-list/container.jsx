import React from "react";
import { fromJS } from "immutable";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions, getListHeaders } from "../../../user";
import NAMESPACE from "../namespace";
import { CREATE_RECORDS, RESOURCES } from "../../../../libs/permissions";
import { useThemeHelper } from "../../../../libs";
import styles from "../styles.css";

import { NAME } from "./constants";
import { fetchUserGroups } from "./action-creators";

const Container = () => {
  const i18n = useI18n();
  const headers = useSelector(state =>
    getListHeaders(state, RESOURCES.user_groups)
  );
  const canAddUserGroups = usePermissions(NAMESPACE, CREATE_RECORDS);
  const recordType = RESOURCES.user_groups;

  const columns = headers.map(({ name, field_name: fieldName, ...rest }) => ({
    label: i18n.t(name),
    name: fieldName,
    ...rest
  }));

  const { css, mobileDisplay } = useThemeHelper(styles);

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
    onTableChange: fetchUserGroups
  };

  const renderNewText = !mobileDisplay ? i18n.t("buttons.new") : null;

  const newUserGroupBtn = canAddUserGroups ? (
    <Button
      to={ROUTES.admin_user_groups_new}
      component={Link}
      color="primary"
      className={css.showActionButton}
    >
      <AddIcon />
      {renderNewText}
    </Button>
  ) : null;

  return (
    <>
      <PageHeading title={i18n.t("user_groups.label")}>
        {newUserGroupBtn}
      </PageHeading>
      <PageContent>
        <IndexTable {...tableOptions} />
      </PageContent>
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {};

export default Container;
