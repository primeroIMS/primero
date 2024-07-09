// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import PageContainer, { PageHeading, PageContent } from "../page";
import { useI18n } from "../i18n";
import LoadingIndicator from "../loading-indicator";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import { getMetadata } from "../record-list";
import { useMetadata } from "../records";
import IndexTable from "../index-table";
import { ROUTES } from "../../config";

import { fetchInsights } from "./action-creators";
import { selectInsights, selectLoading } from "./selectors";
import NAMESPACE from "./namespace";

function Container() {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const insights = useMemoizedSelector(state => selectInsights(state));
  const isLoading = useMemoizedSelector(state => selectLoading(state));
  const metadata = useMemoizedSelector(state => getMetadata(state, NAMESPACE));

  useMetadata(NAMESPACE, metadata, fetchInsights, "options");

  const handleRowClick = record => {
    dispatch(
      push([ROUTES.insights, record.get("module_id"), record.get("id"), record.getIn(["subreports", 0])].join("/"))
    );
  };

  const columns = ["name", "description"].map(column => ({
    name: column,
    label: i18n.t(column),
    options: {
      customBodyRender: value => i18n.t(value)
    }
  }));

  return (
    <div>
      <PageContainer>
        <PageHeading title={i18n.t("managed_reports.label")} />
        <PageContent>
          <LoadingIndicator hasData={insights.size > 0} loading={isLoading} type="reports">
            <IndexTable
              title={i18n.t("managed_reports.label")}
              columns={columns}
              recordType={NAMESPACE}
              onTableChange={fetchInsights}
              onRowClick={handleRowClick}
              defaultFilters={metadata}
              bypassInitialFetch
              options={{ selectableRows: "none" }}
            />
          </LoadingIndicator>
        </PageContent>
      </PageContainer>
    </div>
  );
}

Container.displayName = "InsightsList";

export default Container;
