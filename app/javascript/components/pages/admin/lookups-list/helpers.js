import React from "react";
import truncate from "lodash/truncate";
import { TableCell, Grid, Typography } from "@material-ui/core";

export const columns = i18n => [
  {
    label: i18n.t("lookup.name"),
    name: "name",
    options: {
      sort: false
    }
  },
  {
    label: i18n.t("lookup.values"),
    name: "values",
    options: {
      sort: false,
      customBodyRender: value => {
        return truncate(value, { length: 60, separator: "..." });
      }
    }
  }
];
