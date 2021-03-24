import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

import { ExportReportGraphIcon, ExportReportDataIcon } from "../../../images/primero-icons";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";

import styles from "./styles.css";
import { downloadFile, tableToCsv } from "./utils";
import { DEFAULT_FILE_NAME, NAME } from "./constants";

const useStyles = makeStyles(styles);

const Exporter = ({ includesGraph }) => {
  const css = useStyles();
  const handleClickTableExporter = () => {
    const csvBlob = new Blob([tableToCsv("table tr")], { type: "text/csv" });

    downloadFile(csvBlob, `${DEFAULT_FILE_NAME}.csv`);
  };

  const handleClickGraphExporter = e => {
    e.preventDefault();

    const canvas = document.getElementById("reportGraph");

    canvas.toBlob(blob => {
      downloadFile(blob, `${DEFAULT_FILE_NAME}.png`);
    });
  };

  const renderGraphExporter = includesGraph && (
    <ActionButton
      icon={<ExportReportGraphIcon />}
      type={ACTION_BUTTON_TYPES.icon}
      isTransparent
      rest={{
        className: css.icon,
        onClick: handleClickGraphExporter
      }}
    />
  );

  return (
    <>
      {renderGraphExporter}
      <ActionButton
        icon={<ExportReportDataIcon />}
        type={ACTION_BUTTON_TYPES.icon}
        isTransparent
        rest={{
          className: css.icon,
          onClick: handleClickTableExporter
        }}
      />
    </>
  );
};

Exporter.displayName = NAME;

Exporter.defaultProps = {
  includesGraph: false
};

Exporter.propTypes = {
  includesGraph: PropTypes.bool
};

export default Exporter;
