// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { push } from "connected-react-router";

import DisableOffline from "../disable-offline";
import PageContainer, { PageHeading, PageContent } from "../page";
import { useI18n } from "../i18n";
import { ROUTES } from "../../config";
import { usePermissions, CREATE_RECORDS } from "../permissions";
import { displayNameHelper, useMemoizedSelector } from "../../libs";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import { getMetadata } from "../record-list";
import { useMetadata } from "../records";
import IndexTable from "../index-table";

import { fetchReports } from "./action-creators";
import NAMESPACE from "./namespace";

const Reports = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const metadata = useMemoizedSelector(state => getMetadata(state, NAMESPACE));

  const canAddReport = usePermissions(NAMESPACE, CREATE_RECORDS);

  useMetadata(NAMESPACE, metadata, fetchReports, "options");

  const newReportBtn = canAddReport ? (
    <DisableOffline>
      <ActionButton
        icon={<AddIcon />}
        text="buttons.new"
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          to: ROUTES.reports_new,
          component: Link
        }}
      />
    </DisableOffline>
  ) : null;

  const columns = ["name", "description"].map(column => ({
    name: column,
    label: i18n.t(column),
    options: {
      // eslint-disable-next-line react/display-name, react/no-multi-comp
      customBodyRender: value => (
        <DisableOffline>
          <span>{displayNameHelper(value, i18n.locale)}</span>
        </DisableOffline>
      )
    }
  }));

  const handleRowClick = record => {
    dispatch(push([ROUTES.reports, record.get("id")].join("/")));
  };

  return (
    <div>
      <PageContainer>
        <PageHeading title={i18n.t("reports.label")}>{newReportBtn}</PageHeading>
        <PageContent>
          <IndexTable
            title={i18n.t("reports.label")}
            columns={columns}
            recordType={NAMESPACE}
            onTableChange={fetchReports}
            onRowClick={handleRowClick}
            defaultFilters={metadata}
            bypassInitialFetch
            options={{ selectableRows: "none" }}
            checkOnline
          />
        </PageContent>
      </PageContainer>
    </div>
  );
};

Reports.displayName = "Reports";

export default Reports;
