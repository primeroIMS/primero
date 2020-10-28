/* eslint-disable no-restricted-syntax */
import React from "react";
import { makeStyles } from "@material-ui/styles";

import { ExportReportDataIcon } from "../../../images/primero-icons";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";

import styles from "./styles.css";
import { downloadFile, tableToCsv } from "./utils";
import { DEFAULT_FILE_NAME, TABLE_EXPORTER_NAME } from "./constants";

const TableExporter = () => {
  const css = makeStyles(styles)();
  const handleClick = () => {
    const csvBlob = new Blob([tableToCsv("table tr")], { type: "text/csv" });

    downloadFile(csvBlob, `${DEFAULT_FILE_NAME}.csv`);
  };

  return (
    <ActionButton
      icon={<ExportReportDataIcon />}
      type={ACTION_BUTTON_TYPES.icon}
      isTransparent
      rest={{
        className: css.icon,
        onClick: handleClick
      }}
    />
  );
};

TableExporter.displayName = TABLE_EXPORTER_NAME;

export default TableExporter;
