import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { fromJS } from "immutable";
import { push } from "connected-react-router";

import { useI18n } from "../../../i18n";
import { ROUTES, RECORD_PATH } from "../../../../config";
import { PageHeading, PageContent } from "../../../page";
import IndexTable from "../../../index-table";
import { MANAGE, RESOURCES } from "../../../../libs/permissions";
import Permission from "../../../application/permission";
import { useThemeHelper } from "../../../../libs";
import adminStyles from "../styles.css";

import { NAME } from "./constants";
import { fetchAdminLookups } from "./action-creators";
import styles from "./styles.css";
import { columns } from "./utils";

const Component = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { css: cssAdmin } = useThemeHelper(adminStyles);
  const { css, mobileDisplay } = useThemeHelper(styles);

  const renderNewText = !mobileDisplay ? i18n.t("buttons.new") : null;

  const newUserGroupBtn = (
    <Button
      to={ROUTES.lookups_new}
      component={Link}
      color="primary"
      className={cssAdmin.showActionButton}
    >
      <AddIcon />
      {renderNewText}
    </Button>
  );

  const onRowClick = data =>
    dispatch(push(`${RECORD_PATH.lookups}/${data?.rowData[0]}`));

  const tableOptions = {
    recordType: ["admin", "lookups"],
    columns: columns(i18n, css, onRowClick),
    options: {
      selectableRows: "none"
    },
    defaultFilters: fromJS({
      per: 20,
      page: 1
    }),
    onTableChange: fetchAdminLookups,
    localizedFields: ["name", "values"],
    targetRecordType: "lookups"
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
