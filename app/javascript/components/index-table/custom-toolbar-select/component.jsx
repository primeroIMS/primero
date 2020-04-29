import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { ButtonBase, Typography } from "@material-ui/core";

import { useI18n } from "../../i18n";

import styles from "./styles.css";
import { NAME } from "./constants";
import { selectAllRecords } from "./utils";

const Component = ({
  displayData,
  recordType,
  perPage,
  selectedRecords,
  selectedRows,
  setSelectedRecords,
  totalRecords
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const allRecordsSelected =
    Object.values(selectedRecords).flat()?.length === totalRecords;

  const selectedRecordsMessage = i18n.t(`${recordType}.selected_records`, {
    select_records: allRecordsSelected ? totalRecords : selectedRows.data.length
  });

  const selectAllMessage = allRecordsSelected
    ? i18n.t("buttons.clear_selection")
    : i18n.t(`${recordType}.selected_all_records`, {
        total_records: totalRecords
      });

  const handleClick = () => {
    if (allRecordsSelected) {
      setSelectedRecords({});

      return;
    }
    setSelectedRecords(selectAllRecords(totalRecords, perPage));
  };

  const selectAllButton =
    selectedRows.data.length === displayData?.length ? (
      <div className={css.customToolbarAll}>
        <ButtonBase className={css.selectAllButton} onClick={handleClick}>
          {selectAllMessage}
        </ButtonBase>
      </div>
    ) : null;

  return (
    <div className={css.customToolbarFull}>
      <div className={css.customToolbarTitle}>
        <Typography component="h6">{selectedRecordsMessage}</Typography>
      </div>
      {selectAllButton}
    </div>
  );
};

Component.propTypes = {
  displayData: PropTypes.array,
  perPage: PropTypes.number,
  recordType: PropTypes.string,
  selectedRecords: PropTypes.object,
  selectedRows: PropTypes.object,
  setSelectedRecords: PropTypes.func,
  totalRecords: PropTypes.number
};

Component.displayName = NAME;

export default Component;
