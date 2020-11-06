import React, { useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { fromJS } from "immutable";
import { useDispatch, useSelector, batch } from "react-redux";
import isEqual from "lodash/isEqual";
import Tooltip from "@material-ui/core/Tooltip";
import clsx from "clsx";
import { push } from "connected-react-router";

import { useI18n } from "../../i18n";
import { TasksOverdue, TasksPending } from "../../../images/primero-icons";
import IndexTable from "../../index-table";
import PageContainer, { PageHeading, PageContent } from "../../page";
import { DashboardChip } from "../../dashboard";
import { getOption, getFields, getAllForms } from "../../record-form";
import { LOOKUPS, RECORD_TYPES } from "../../../config";
import { compare } from "../../../libs";
import { setSelectedForm } from "../../record-form/action-creators";

import { getMetadata, selectListHeaders } from "./selectors";
import { fetchTasks } from "./action-creators";
import styles from "./styles.css";
import { TASK_TYPES, TASK_STATUS } from "./constants";

const TaskList = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const recordType = "tasks";
  const dispatch = useDispatch();
  const defaultFilters = {
    per: 20,
    page: 1
  };
  const listHeaders = useSelector(state => selectListHeaders(state, recordType));

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
  const fields = useSelector(state => getFields(state), compare);
  const forms = useSelector(state => getAllForms(state), compare);
  const fieldNames = useSelector(state => getMetadata(state, "field_names"), compare);

  useEffect(() => {
    dispatch(fetchTasks({ options: defaultFilters }));
  }, []);

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
                        value ? i18n.t(`task.priorities.${value}_level`) : i18n.t("task.priorities.no_action_level")
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
                        )?.display_text
                      : lookupFollowupType.find(
                          followup => followup.id === lookupAction
                          // eslint-disable-next-line camelcase
                        )?.display_text;

                  const renderValue = [TASK_TYPES.SERVICE, TASK_TYPES.FOLLOW_UP].includes(value)
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
                    `task.statuses.${overdue ? TASK_STATUS.overdue : TASK_STATUS.upcomingSoon}`
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
            : {}),
          ...(c.name === "due_date"
            ? {
                // eslint-disable-next-line react/no-multi-comp, react/display-name
                customBodyRender: (value, tableMeta) => {
                  const recordData = data.get("data").get(tableMeta.rowIndex);
                  const fieldName = fieldNames.get(recordData.get("type"));
                  const selectedField = fields.filter(field => field.name === fieldName);

                  const fieldKey = [...selectedField.keys()][0];
                  const translatedFieldName = selectedField.first().display_name[i18n.locale];
                  const selectedForm = forms.find(form => form.get("fields").includes(parseInt(fieldKey, 10)));

                  return (
                    <Tooltip
                      title={i18n.t("messages.field_name_on_form_name", {
                        field_name: translatedFieldName,
                        form_name: selectedForm.name[i18n.locale]
                      })}
                    >
                      <span>{value}</span>
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

  const filterFormsWithModule = (moduleId, subforms) => {
    const subformKeys = [...subforms.keys()].map(subformKey => parseInt(subformKey, 10));
    const subformFields = fields.filter(field => subformKeys.includes(field.subform_section_id));
    const subformFieldKeys = [...subformFields.keys()].map(subformKey => parseInt(subformKey, 10));

    return forms.find(
      form => form.fields.some(field => subformFieldKeys.includes(field)) && form.module_ids.includes(moduleId)
    ).unique_id;
  };

  const onRowClick = record => {
    const selectedField = fields.filter(field => field.name === record.get("completion_field"));

    const fieldKeys = [...selectedField.keys()].map(selected => parseInt(selected, 10));
    const selectedForms = forms.filter(form => form.get("fields").some(field => fieldKeys.includes(field)));
    const to = Object.keys(RECORD_TYPES).find(key => RECORD_TYPES[key] === record.get("record_type"));

    const formName = selectedForms.some(form => form.is_nested)
      ? filterFormsWithModule(record.get("module_unique_id"), selectedForms)
      : selectedForms.first().unique_id;

    batch(() => {
      dispatch(push(`${to}/${record.get("id")}`));
      if (formName !== "basic_identity") {
        dispatch(setSelectedForm(formName));
      }
    });
  };

  const options = {
    selectableRows: "none"
  };

  const tableOptions = {
    recordType,
    columns,
    options,
    defaultFilters: fromJS(defaultFilters),
    onTableChange: fetchTasks,
    targetRecordType: "cases",
    bypassInitialFetch: true,
    onRowClick: record => onRowClick(record)
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
