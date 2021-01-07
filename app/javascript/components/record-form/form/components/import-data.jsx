import React, { useState } from "react";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import ActionDialog from "../../../action-dialog";

import { IMPORT_DATA_NAME, IMPORT_DATA_STATUS } from "./constants";
import styles from "./styles.css";

const ImportData = ({ i18n, lastImportDate }) => {
  const css = makeStyles(styles)();
  const [open, setOpen] = useState(false);
  const [importDataStatus, setImportDataStatus] = useState(IMPORT_DATA_STATUS.last);

  // TODO implement the import action
  const handleImport = async () => {
    console.log("importing data...");
    setImportDataStatus(IMPORT_DATA_STATUS.retrieving);
    await new Promise(r => setTimeout(r, 3000));
    setImportDataStatus(IMPORT_DATA_STATUS.failed);

    // setImportDataStatus(IMPORT_DATA_STATUS.last);
  };
  const onClick = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const labelImportData = i18n.t(`import_data.${importDataStatus}`, { date_time: lastImportDate });
  const seeDetails = importDataStatus === IMPORT_DATA_STATUS.failed && (
    <ButtonBase className={css.seeDetailsStyle} onClick={onClick}>
      {i18n.t("import_data.see_details")}
    </ButtonBase>
  );
  const renderDetails = importDataStatus === IMPORT_DATA_STATUS.failed && (
    <ActionDialog
      dialogTitle={i18n.t("import_data.failed")}
      onClose={onClose}
      cancelHandler={onClose}
      open={open}
      maxSize="sm"
      disableActions
    >
      <h6>Details of failed data import!!!</h6>
    </ActionDialog>
  );

  return (
    <div className={css.importDataClass}>
      <span className={css.importDataLabelClass}>
        {labelImportData}
        {seeDetails}
      </span>
      <ActionButton
        text={i18n.t("buttons.import_data")}
        type={ACTION_BUTTON_TYPES.default}
        pending={importDataStatus === IMPORT_DATA_STATUS.retrieving}
        outlined
        rest={{
          size: "small",
          onClick: handleImport
        }}
      />
      {renderDetails}
    </div>
  );
};

ImportData.displayName = IMPORT_DATA_NAME;

ImportData.defaultProps = {
  lastImportDate: "--"
};

ImportData.propTypes = {
  i18n: PropTypes.shape({
    t: PropTypes.func
  }),
  lastImportDate: PropTypes.string
};

export default ImportData;
