import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { fromJS } from "immutable";
import { format, parseISO } from "date-fns";

import { useI18n } from "../../../i18n";
import { ROUTES, DATE_TIME_FORMAT } from "../../../../config";
import { RESOURCES, SHOW_AUDIT_LOGS } from "../../../../libs/permissions";
import { PageHeading, PageContent } from "../../../page";
import IndexTable from "../../../index-table";
import Permission from "../../../application/permission";

import { NAME, AUDIT_LOG } from "./constants";
import { fetchAuditLogs, fetchPerformedBy } from "./action-creators";
import { Filters } from "./components";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPerformedBy({ options: { per: 999 } }));
  }, []);

  const newUserGroupBtn = (
    <Button
      to={ROUTES.lookups}
      component={Link}
      color="primary"
      startIcon={<AddIcon />}
    >
      {i18n.t("buttons.new")}
    </Button>
  );

  const tableOptions = {
    recordType: ["admin", AUDIT_LOG],
    columns: [
      {
        label: i18n.t("audit_log.timestamp"),
        name: "timestamp",
        options: {
          customBodyRender: value => format(parseISO(value), DATE_TIME_FORMAT)
        }
      },
      {
        label: i18n.t("audit_log.user_name"),
        name: "user_name"
      },
      {
        label: i18n.t("audit_log.action"),
        name: "action"
      },
      {
        label: i18n.t("audit_log.description"),
        name: "log_message"
      },
      {
        label: i18n.t("audit_log.record_owner"),
        name: "user_name"
      }
    ],
    options: {
      selectableRows: "none",
      onCellClick: false
    },
    defaultFilters: fromJS({
      per: 20,
      page: 1
    }),
    onTableChange: fetchAuditLogs
  };

  return (
    <Permission
      resources={RESOURCES.audit_logs}
      actions={SHOW_AUDIT_LOGS}
      redirect
    >
      <PageHeading title={i18n.t("settings.navigation.audit_logs")}>
        {newUserGroupBtn}
      </PageHeading>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <IndexTable {...tableOptions} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Filters />
          </Grid>
        </Grid>
      </PageContent>
    </Permission>
  );
};

Container.displayName = NAME;

export default Container;
