import React from "react";
// TODO: Will have to render icons when integrating to endpoint
// import Schedule from "@material-ui/icons/Schedule";
// import PriorityHigh from "@material-ui/icons/PriorityHigh";
import { useI18n } from "components/i18n";
import { IndexTable } from "components/index-table";
import { PageContainer, PageHeading, PageContent } from "components/page";
import { Map } from "immutable";
import { useSelector } from "react-redux";
import { selectListHeaders } from "./selectors";
import { fetchTasks } from "./action-creators";

const TaskList = () => {
  const i18n = useI18n();
  const recordType = "tasks";
  const listHeaders = useSelector(state =>
    selectListHeaders(state, recordType)
  );

  const columns = listHeaders.map(c => ({
    name: c.field_name,
    label: c.name
  }));

  const options = {
    selectableRows: "none"
  };

  const tableOptions = {
    recordType,
    columns,
    options,
    defaultFilters: Map({
      per: 20,
      page: 1
    }),
    onTableChange: fetchTasks
  };

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.tasks")} />
      <PageContent>
        <IndexTable {...tableOptions} />
      </PageContent>
    </PageContainer>
  );
};

export default TaskList;
