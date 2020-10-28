import React from "react";
import { makeStyles } from "@material-ui/styles";

import { ExportReportGraphIcon } from "../../../images/primero-icons";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";

import styles from "./styles.css";
import { downloadFile } from "./utils";
import { DEFAULT_FILE_NAME, GRAPH_EXPORTER_NAME } from "./constants";

const GraphExporter = () => {
  const css = makeStyles(styles)();
  const handleClick = e => {
    e.preventDefault();

    const canvas = document.getElementById("reportGraph");

    canvas.toBlob(blob => {
      downloadFile(blob, `${DEFAULT_FILE_NAME}.png`);
    });
  };

  return (
    <ActionButton
      icon={<ExportReportGraphIcon />}
      type={ACTION_BUTTON_TYPES.icon}
      isTransparent
      rest={{
        className: css.icon,
        onClick: handleClick
      }}
    />
  );
};

GraphExporter.displayName = GRAPH_EXPORTER_NAME;

export default GraphExporter;
