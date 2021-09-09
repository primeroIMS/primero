/* eslint-disable react/no-multi-comp */
/* eslint-disable import/prefer-default-export */

import { fromJS } from "immutable";

import { ToggleIconCell } from "../index-table";
import { RECORD_PATH, RECORD_TYPES, DATE_TIME_FORMAT } from "../../config";
import { ConditionalWrapper } from "../../libs";
import DisableOffline from "../disable-offline";

import { ALERTS_COLUMNS, ALERTS, ID_COLUMNS } from "./constants";
import PhotoColumnBody from "./components/photo-column-body";
import PhotoColumnHeader from "./components/photo-column-header";

export const buildTableColumns = (allowedColumns, i18n, recordType, css, recordAvailable, online) => {
  const iconColumns = Object.values(ALERTS_COLUMNS);

  // eslint-disable-next-line react/display-name, jsx-a11y/control-has-associated-label
  const emptyHeader = name => <th key={name} className={css.overdueHeading} />;

  const tableColumns = data => {
    // eslint-disable-next-line react/display-name, jsx-a11y/control-has-associated-label, react/prop-types
    const disableColumnOffline = args => {
      const { component: Component, props = {}, value, rowIndex } = args || {};
      const rowAvailable = recordAvailable(data.getIn(["data", rowIndex], fromJS({}))) || online;
      const parsedValue = Array.isArray(value) ? value.join(", ") : value;

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
                // eslint-disable-next-line react/no-multi-comp, react/display-name
                customHeadRender: (columnMeta, handleToggleColumn) => (
                  <PhotoColumnHeader
                    css={css}
                    columnMeta={columnMeta}
                    handleToggleColumn={handleToggleColumn}
                    key={`photo-column-${name}`}
                    i18n={i18n}
                    recordType={recordType}
                  />
                ),
                // eslint-disable-next-line react/no-multi-comp, react/display-name
                customBodyRender: (value, { rowIndex }) =>
                  disableColumnOffline({ component: PhotoColumnBody, props: { value, css }, rowIndex })
              };
            case "registration_date":
              return {
                customBodyRender: (value, { rowIndex }) =>
                  disableColumnOffline({ value: i18n.localizeDate(value), rowIndex })
              };
            case "case_opening_date":
              return {
                customBodyRender: (value, { rowIndex }) =>
                  disableColumnOffline({ value: value && i18n.localizeDate(value, DATE_TIME_FORMAT), rowIndex })
              };
            case "id":
              return {
                customBodyRender: (value, { rowData, rowIndex }) => {
                  const idValue = column.get("field_name") === ID_COLUMNS.case_id_display ? value || rowData[1] : value;

                  return disableColumnOffline({ value: idValue, rowIndex });
                }
              };
            default:
              return {
                customBodyRender: (value, { rowIndex }) => disableColumnOffline({ value, rowIndex })
              };
          }
        })(column.get("name"));

        return {
          label: iconColumns.includes(column.get("name")) ? "" : i18n.t(`${recordType}.${column.get("name")}`),
          name: column.get("field_name"),
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
