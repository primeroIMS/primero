import { fromJS } from "immutable";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../action-button";

function buildTableOptions({ i18n, handleRowClick, recordTypeValue }) {
  return {
    columns: [
      {
        name: "case.id",
        options: {
          display: false
        }
      },
      {
        name: "id",
        options: {
          display: false
        }
      },
      {
        label: i18n.t("potential_match.name"),
        name: "name"
      },
      {
        label: i18n.t("potential_match.case_id"),
        name: "case_id_display",
        options: {
          customBodyRender: (value, tableMeta) => {
            const { rowData } = tableMeta;

            return (
              <ActionButton
                id="case.case_id_display-button"
                text={value}
                type={ACTION_BUTTON_TYPES.default}
                variant="text"
                color="primary"
                noTranslate
                onClick={() => handleRowClick(rowData[1], rowData[3])}
              />
            );
          }
        }
      },
      {
        label: i18n.t("potential_match.child_age"),
        name: "age"
      },
      {
        label: i18n.t("potential_match.child_gender"),
        name: "sex"
      }
    ],
    defaultFilters: fromJS({}),
    recordType: recordTypeValue,
    targetRecordType: recordTypeValue,
    bypassInitialFetch: true,
    options: {
      selectableRows: "none",
      onCellClick: false,
      elevation: 0,
      pagination: true
    }
  };
}

// eslint-disable-next-line import/prefer-default-export
export { buildTableOptions };
