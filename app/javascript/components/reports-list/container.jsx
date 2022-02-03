import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import { push } from "connected-react-router";

import DisableOffline from "../disable-offline";
import PageContainer, { PageHeading, PageContent } from "../page";
import { useI18n } from "../i18n";
import LoadingIndicator from "../loading-indicator";
import { ROUTES } from "../../config";
import { usePermissions } from "../user";
import { CREATE_RECORDS } from "../../libs/permissions";
import { displayNameHelper, useMemoizedSelector } from "../../libs";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import { getMetadata } from "../record-list";
import { useMetadata } from "../records";
import IndexTable from "../index-table";

import { fetchReports } from "./action-creators";
import { selectReports, selectLoading } from "./selectors";
import NAMESPACE from "./namespace";

const Reports = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const reports = useMemoizedSelector(state => selectReports(state));
  const isLoading = useMemoizedSelector(state => selectLoading(state));
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
          <LoadingIndicator hasData={reports.size > 0} loading={isLoading} type="reports">
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
          </LoadingIndicator>
        </PageContent>
      </PageContainer>
    </div>
  );
};

Reports.displayName = "Reports";

export default Reports;
