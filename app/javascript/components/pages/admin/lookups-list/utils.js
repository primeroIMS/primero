/* eslint-disable
import/prefer-default-export, react/display-name, jsx-a11y/click-events-have-key-events, react/no-multi-comp */

import React from "react";

export const columns = (i18n, css, onRowClick) => [
  {
    label: "id",
    name: "id",
    options: {
      display: false
    }
  },
  {
    label: i18n.t("lookup.name"),
    name: "name",
    options: {
      customBodyRender: (value, tableMeta) => (
        <div
          onClick={() => onRowClick(tableMeta)}
          role="button"
          tabIndex={tableMeta.rowIndex}
          className={css.lookupName}
        >
          {value}
        </div>
      )
    }
  },
  {
    label: i18n.t("lookup.values"),
    name: "values",
    options: {
      customBodyRender: (value, tableMeta) => {
        return (
          <div
            onClick={() => onRowClick(tableMeta)}
            role="button"
            tabIndex={tableMeta.rowIndex}
            className={css.truncateValues}
          >
            <div>{value}</div>
          </div>
        );
      }
    }
  }
];
