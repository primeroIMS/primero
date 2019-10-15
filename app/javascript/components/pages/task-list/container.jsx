import React from "react";
import { TasksOverdue, TasksPending } from "images/primero-icons";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/styles/";
import { IndexTable } from "components/index-table";
import { PageContainer, PageHeading, PageContent } from "components/page";
import { Map } from "immutable";
import { useSelector } from "react-redux";
import { selectListHeaders } from "./selectors";
import { fetchTasks } from "./action-creators";
import styles from "./styles.css";

const TaskList = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const recordType = "tasks";
  const listHeaders = useSelector(state =>
    selectListHeaders(state, recordType)
  );
  const columns = data => {
    return listHeaders.map(c => {
      const options = {
        ...{
          ...(c.name === "status"
            ? {
                customBodyRender: (value, tableMeta) => {
                  const recordData = data.get("data").get(tableMeta.rowIndex);
                  const overdue = recordData.get("overdue");
                  const upcomingSoon = recordData.get("upcoming_soon");

                  return (
                    <div className={css.link}>
                      {overdue === true ? <TasksOverdue /> : null}
                      {upcomingSoon === true ? <TasksPending /> : null}
                    </div>
                  );
                }
              }
            : {})
        }
      };
      return {
        name: c.field_name,
        label: i18n.t(`task.${c.name}`),
        options
      };
    });
  };

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
    onTableChange: fetchTasks,
    targetRecordType: "cases"
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
