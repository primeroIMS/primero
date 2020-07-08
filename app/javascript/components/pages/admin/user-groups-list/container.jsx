import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions, getListHeaders } from "../../../user";
import NAMESPACE from "../namespace";
import { CREATE_RECORDS, RESOURCES } from "../../../../libs/permissions";
import { useThemeHelper } from "../../../../libs";
import styles from "../styles.css";
import ButtonText from "../../../button-text";
import { getMetadata } from "../../../record-list";

import { NAME } from "./constants";
import { fetchUserGroups } from "./action-creators";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const headers = useSelector(state =>
    getListHeaders(state, RESOURCES.user_groups)
  );
  const canAddUserGroups = usePermissions(NAMESPACE, CREATE_RECORDS);
  const recordType = RESOURCES.user_groups;
  const metadata = useSelector(state => getMetadata(state, recordType));
  const defaultFilters = metadata;

  const columns = headers.map(({ name, field_name: fieldName, ...rest }) => ({
    label: i18n.t(name),
    name: fieldName,
    ...rest
  }));

  const { css } = useThemeHelper(styles);

  useEffect(() => {
    dispatch(fetchUserGroups({ data: defaultFilters.toJS() }));
  }, []);

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchUserGroups,
    bypassInitialFetch: true
  };

  const newUserGroupBtn = canAddUserGroups ? (
    <Button
      to={ROUTES.admin_user_groups_new}
      component={Link}
      color="primary"
      className={css.showActionButton}
    >
      <AddIcon />
      <ButtonText text={i18n.t("buttons.new")} />
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
