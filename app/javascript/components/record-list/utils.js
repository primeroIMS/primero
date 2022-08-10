/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";
import { Tooltip } from "@material-ui/core";
import OfflinePin from "@material-ui/icons/OfflinePin";

import { ToggleIconCell } from "../index-table";
import { RECORD_PATH, RECORD_TYPES } from "../../config";
import { ConditionalWrapper } from "../../libs";
import DisableOffline from "../disable-offline";

import { ALERTS_COLUMNS, ALERTS, ID_COLUMNS, COMPLETE } from "./constants";
import PhotoColumnBody from "./components/photo-column-body";
import DateColumn from "./components/date-column";

export const buildTableColumns = (allowedColumns, i18n, recordType, css, recordAvailable, online) => {
  const iconColumns = Object.values(ALERTS_COLUMNS);
  // eslint-disable-next-line react/display-name, jsx-a11y/control-has-associated-label
  const emptyHeader = name => <th key={name} className={css.overdueHeading} />;

  const tableColumns = data => {
    // eslint-disable-next-line react/display-name, jsx-a11y/control-has-associated-label, react/prop-types
    const disableColumnOffline = args => {
      const { component: Component, props = {}, value, rowIndex, withTime, type } = args || {};
      const rowAvailable = recordAvailable(data.getIn(["data", rowIndex], fromJS({}))) || online;
      const parsedValue = Array.isArray(value) ? value.join(", ") : value;

      if (type === "date") {
        return (
          <DateColumn rowAvailable={rowAvailable} wrapper={DisableOffline} value={value} valueWithTime={withTime} />
        );
      }

      return (
        <ConditionalWrapper
          condition={!rowAvailable}
          wrapper={DisableOffline}
          offlineTextKey="unavailable_offline"
          overrideCondition={!rowAvailable}
        >
          <>{Component !== undefined ? <Component {...props} /> : parsedValue || ""}</>
        </ConditionalWrapper>
      );
    };

    let columns = allowedColumns
      .filter(column => ![ALERTS_COLUMNS.flag_count, ALERTS_COLUMNS.alert_count].includes(column.get("name")))
      .map(column => {
        const options = (name => {
          switch (name) {
            case ALERTS_COLUMNS.photo:
              return {
                disableOnClick: true,
                customHeadLabelRender: columnMeta => i18n.t(`${recordType}.${columnMeta.name}`),
                setCellHeaderProps: () => {
                  return { style: { width: "45px" } };
                },
                // eslint-disable-next-line react/no-multi-comp, react/display-name
                customBodyRender: (value, { rowIndex }) =>
                  disableColumnOffline({ component: PhotoColumnBody, props: { value, css }, rowIndex })
              };
            case "registration_date":
              return {
                customBodyRender: (value, { rowIndex }) =>
                  disableColumnOffline({ value, withTime: false, rowIndex, type: "date" })
              };
            case "case_opening_date":
              return {
                customBodyRender: (value, { rowIndex }) =>
                  disableColumnOffline({ value, withTime: true, type: "date", rowIndex })
              };
            case "id":
              return {
                // eslint-disable-next-line react/display-name
                customBodyRender: (value, { rowData, rowIndex }) => {
                  const idValue = column.get("field_name") === ID_COLUMNS.case_id_display ? value || rowData[1] : value;

                  return <div className={css.id}>{disableColumnOffline({ value: idValue, rowIndex })}</div>;
                }
              };
            case "complete":
              return {
                customHeadLabelRender: () => <OfflinePin className={css.iconHeader} />,
                sort: !online,
                disableOnClick: true,
                customBodyRender: value => {
                  return value ? (
                    <Tooltip open title={i18n.t("action.marked_for_offline")}>
                      <ToggleIconCell value={value} icon={COMPLETE} />
                    </Tooltip>
                  ) : (
                    <span />
                  );
                }
              };
            default:
              return {
                sort: column.get("sort", true),
                customBodyRender: (value, { rowIndex }) => disableColumnOffline({ value, rowIndex })
              };
          }
        })(column.get("name"));

        return {
          label: [...iconColumns].includes(column.get("name")) ? " " : i18n.t(`${recordType}.${column.get("name")}`),
          name: column.get("field_name") || " ",
          id: column.get("id_search"),
          options: {
            ...options,
            display: !(
              RECORD_TYPES[recordType] === RECORD_TYPES.cases && column.get("field_name") === ID_COLUMNS.short_id
            )
          }
        };
      })
      .sortBy(column => (iconColumns.includes(column.name) ? 1 : 0));

    const canShowAlertIcon = allowedColumns
      .map(allowedColumn => allowedColumn.name)
      .includes(ALERTS_COLUMNS.alert_count);
    const canShowFlagIcon = allowedColumns.map(allowedColumn => allowedColumn.name).includes(ALERTS_COLUMNS.flag_count);

    if ([RECORD_PATH.cases, RECORD_PATH.incidents, RECORD_PATH.tracing_requests].includes(recordType)) {
      columns = columns.push({
        label: "",
        name: ALERTS,
        id: false,
        sort: false,
        options: {
          disableOnClick: true,
          customHeadRender: columnMeta => emptyHeader(columnMeta),
          // eslint-disable-next-line react/no-multi-comp, react/display-name
          customBodyRender: (value, { rowIndex }) => {
            const alertIcon =
              // eslint-disable-next-line camelcase
              canShowAlertIcon && value?.alert_count > 0 ? (
                <ToggleIconCell value={value.alert_count} icon={ALERTS_COLUMNS.alert_count} />
              ) : (
                <span />
              );

            const flagIcon =
              // eslint-disable-next-line camelcase
              canShowFlagIcon && value?.flag_count > 0 ? (
                <ToggleIconCell value={value.flag_count} icon={ALERTS_COLUMNS.flag_count} />
              ) : (
                <span />
              );

            return disableColumnOffline({
              value: (
                <div className={css.alerts}>
                  {alertIcon}
                  {flagIcon}
                </div>
              ),
              rowIndex
            });
          }
        }
      });
    }

    return columns;
  };

  return data => tableColumns(data);
};
