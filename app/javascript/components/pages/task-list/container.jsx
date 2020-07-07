import React from "react";
import { makeStyles } from "@material-ui/styles/";
import { fromJS } from "immutable";
import { useSelector } from "react-redux";
import isEqual from "lodash/isEqual";
import Tooltip from "@material-ui/core/Tooltip";
import clsx from "clsx";

import { useI18n } from "../../i18n";
import { TasksOverdue, TasksPending } from "../../../images/primero-icons";
import IndexTable from "../../index-table";
import PageContainer, { PageHeading, PageContent } from "../../page";
import { DashboardChip } from "../../dashboard";
import { getOption } from "../../record-form";
import { LOOKUPS } from "../../../config";

import { selectListHeaders } from "./selectors";
import { fetchTasks } from "./action-creators";
import styles from "./styles.css";
import { TASK_TYPES, TASK_STATUS } from "./constants";

const TaskList = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const recordType = "tasks";
  const listHeaders = useSelector(state =>
    selectListHeaders(state, recordType)
  );

  const lookupServiceType = useSelector(
    state => getOption(state, LOOKUPS.service_type, i18n.locale),
    (prev, actual) => {
      return isEqual(prev, actual);
    }
  );

  const lookupFollowupType = useSelector(
    state => getOption(state, LOOKUPS.followup_type, i18n.locale),
    (prev, actual) => {
      return isEqual(prev, actual);
    }
  );

  const columns = data => {
    return listHeaders.map(c => {
      const options = {
        ...{
          ...(c.name === "priority"
            ? {
                // eslint-disable-next-line react/no-multi-comp, react/display-name
                customBodyRender: value => {
                  return (
                    <DashboardChip
                      label={
                        value
                          ? i18n.t(`task.priorities.${value}_level`)
                          : i18n.t("task.priorities.no_action_level")
                      }
                      type={value}
                    />
                  );
                }
              }
            : {}),
          ...(c.name === "type"
            ? {
                // eslint-disable-next-line react/no-multi-comp, react/display-name
                customBodyRender: (value, tableMeta) => {
                  const recordData = data.get("data").get(tableMeta.rowIndex);
                  const lookupAction = recordData.get("detail");

                  const translatedValue =
                    value === TASK_TYPES.SERVICE
                      ? lookupServiceType.find(
                          serviceType => serviceType.id === lookupAction
                          // eslint-disable-next-line camelcase
                        )?.display_text[i18n.locale]
                      : lookupFollowupType.find(
                          followup => followup.id === lookupAction
                          // eslint-disable-next-line camelcase
                        )?.display_text[i18n.locale];

                  const renderValue = [
                    TASK_TYPES.SERVICE,
                    TASK_TYPES.FOLLOW_UP
                  ].includes(value)
                    ? i18n.t(`task.types.${value}`, {
                        subtype: translatedValue
                      })
                    : i18n.t(`task.types.${value}`);

                  return <span>{renderValue}</span>;
                }
              }
            : {}),
          ...(c.name === "status"
            ? {
                // eslint-disable-next-line react/no-multi-comp, react/display-name
                customBodyRender: (value, tableMeta) => {
                  const recordData = data.get("data").get(tableMeta.rowIndex);
                  const overdue = recordData.get(TASK_STATUS.overdue);
                  const upcomingSoon = recordData.get(TASK_STATUS.upcomingSoon);
                  const cssNames = clsx([
                    css.link,
                    {
                      [css[TASK_STATUS.overdue]]: overdue,
                      [css[TASK_STATUS.upcomingSoon]]: upcomingSoon
                    }
                  ]);
                  const tooltipTitle = i18n.t(
                    `task.statuses.${
                      overdue ? TASK_STATUS.overdue : TASK_STATUS.upcomingSoon
                    }`
                  );

                  return (
                    <Tooltip placement="left" title={tooltipTitle}>
                      <div className={cssNames}>
                        {overdue ? <TasksOverdue /> : null}
                        {upcomingSoon ? <TasksPending /> : null}
                      </div>
                    </Tooltip>
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
    defaultFilters: fromJS({
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
        <IndexTable title={i18n.t("navigation.tasks")} {...tableOptions} />
      </PageContent>
    </PageContainer>
  );
};

TaskList.displayName = "TaskList";

export default TaskList;
