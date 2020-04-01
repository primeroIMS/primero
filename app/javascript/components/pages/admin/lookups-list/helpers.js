/* eslint-disable import/prefer-default-export */

import React from "react";

export const columns = (i18n, css) => [
  {
    label: i18n.t("lookup.name"),
    name: "name",
    options: {
      customBodyRender: value => {
        return <div className={css.lookupName}>{value}</div>;
      }
    }
  },
  {
    label: i18n.t("lookup.values"),
    name: "values",
    options: {
      // eslint-disable-next-line react/no-multi-comp, react/display-name
      customBodyRender: value => {
        return (
          <div className={css.truncateValues}>
            <div>{value}</div>
          </div>
        );
      }
    }
  }
];
