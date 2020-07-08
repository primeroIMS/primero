import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { push } from "connected-react-router";

import { useI18n } from "../../../i18n";
import { ROUTES, RECORD_PATH } from "../../../../config";
import { PageHeading, PageContent } from "../../../page";
import IndexTable from "../../../index-table";
import { MANAGE, RESOURCES } from "../../../../libs/permissions";
import Permission from "../../../application/permission";
import { useThemeHelper } from "../../../../libs";
import adminStyles from "../styles.css";
import ButtonText from "../../../button-text";
import { getMetadata } from "../../../record-list";

import { NAME } from "./constants";
import { fetchAdminLookups } from "./action-creators";
import styles from "./styles.css";
import { columns } from "./utils";

const Component = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { css: cssAdmin } = useThemeHelper(adminStyles);
  const { css } = useThemeHelper(styles);
  const recordType = ["admin", "lookups"];
  const metadata = useSelector(state => getMetadata(state, recordType));
  const defaultFilters = metadata;

  const newUserGroupBtn = (
    <Button
      to={ROUTES.lookups_new}
      component={Link}
      color="primary"
      className={cssAdmin.showActionButton}
    >
      <AddIcon />
      <ButtonText text={i18n.t("buttons.new")} />
    </Button>
  );

  useEffect(() => {
    dispatch(fetchAdminLookups({ data: defaultFilters.toJS() }));
  }, []);

  const onRowClick = data =>
    dispatch(push(`${RECORD_PATH.lookups}/${data?.rowData[0]}`));

  const tableOptions = {
    recordType,
    columns: columns(i18n, css, onRowClick),
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchAdminLookups,
    localizedFields: ["name", "values"],
    targetRecordType: "lookups",
    bypassInitialFetch: true
  };

  return (
    <Permission resources={RESOURCES.metadata} actions={MANAGE} redirect>
      <PageHeading title={i18n.t("settings.navigation.lookups")}>
        {newUserGroupBtn}
      </PageHeading>
      <PageContent>
        <IndexTable {...tableOptions} />
      </PageContent>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {};

export default Component;
