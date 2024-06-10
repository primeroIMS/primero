// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useI18n } from "../../../i18n";
import FiltersDialog from "../filters-dialog";
import FiltersList from "../filters-list";
import { DEFAULT_FILTERS, MATCH_REPORTABLE_TYPES, RECORD_STATE_FIELD, STATUS_FIELD } from "../../constants";
import { formattedFields } from "../../utils";
import ActionDialog from "../../../action-dialog";
import { useMemoizedSelector } from "../../../../libs";
import { getRecordFields } from "../../../record-form/selectors";

import { NAME } from "./constants";
import css from "./styles.css";
import { onFilterDialogSuccess } from "./utils";

const Container = ({
  indexes,
  setIndexes,
  allRecordForms,
  parentFormMethods,
  reportingLocationConfig,
  formattedMinimumReportableFields,
  formMode,
  selectedRecordType,
  selectedModule
}) => {
  const i18n = useI18n();

  const matchableRecordType = MATCH_REPORTABLE_TYPES[selectedRecordType] || selectedRecordType;

  const recordFields = useMemoizedSelector(state =>
    getRecordFields(state, { recordType: matchableRecordType, primeroModule: selectedModule })
  );

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [open, setOpen] = useState(false);

  const onSuccess = onFilterDialogSuccess({ indexes, parentFormMethods, setIndexes, i18n });

  const fields = formattedFields(
    allRecordForms,
    selectedModule,
    selectedRecordType,
    i18n,
    reportingLocationConfig,
    formattedMinimumReportableFields
  );

  const recordFieldNames = recordFields.map(field => field.name);
  const minimumReportableFields = formattedMinimumReportableFields[matchableRecordType]?.filter(
    field => recordFieldNames.includes(field.id) || [RECORD_STATE_FIELD, STATUS_FIELD].includes(field.id)
  );
  const reportableFields = fields.concat(minimumReportableFields || []);

  const filterIndexes = indexes.filter(currentIndex =>
    reportableFields.some(reportableField => reportableField.id === currentIndex.data.attribute)
  );

  useEffect(() => {
    if (selectedRecordType && formMode.isNew) {
      const reportableFieldNames = reportableFields.filter(f => f.visible === true).map(f => f.id);

      setIndexes(
        DEFAULT_FILTERS[selectedRecordType]
          .filter(defaultFilter => reportableFieldNames.includes(defaultFilter.attribute))
          .map((data, index) => ({ index, data }))
      );
    }
  }, [selectedRecordType]);

  if (!fields.length) {
    return null;
  }

  const handleNew = () => {
    setOpen(true);
  };

  const handleEdit = index => {
    setSelectedIndex(index.toString());
    setOpen(true);
  };

  const handleDelete = () => {
    const index = selectedIndex;

    setIndexes([...indexes.slice(0, parseInt(index, 10)), ...indexes.slice(parseInt(index, 10) + 1, indexes.length)]);
  };

  const handleOpenModal = index => {
    setSelectedIndex(index);
    setDeleteModal(true);
  };

  const cancelHandler = () => {
    setDeleteModal(false);
    setSelectedIndex(null);
  };

  return (
    <>
      <Typography className={css.filtersHeading}>
        {i18n.t("report.filters.label")}
        <IconButton size="small" onClick={handleNew} className={css.addFilter}>
          <AddIcon />
          {i18n.t("buttons.new")}
        </IconButton>
      </Typography>

      <FiltersList handleOpenModal={handleOpenModal} handleEdit={handleEdit} indexes={filterIndexes} />

      <ActionDialog
        open={deleteModal}
        successHandler={handleDelete}
        cancelHandler={cancelHandler}
        dialogTitle={i18n.t("fields.remove")}
        dialogText={i18n.t("report.filters.delete_filter_message")}
        confirmButtonLabel={i18n.t("buttons.ok")}
      />

      <FiltersDialog
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        open={open}
        setOpen={setOpen}
        indexes={indexes}
        fields={fields}
        onSuccess={onSuccess}
      />
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  allRecordForms: PropTypes.object.isRequired,
  formattedMinimumReportableFields: PropTypes.object,
  formMode: PropTypes.object,
  indexes: PropTypes.array,
  parentFormMethods: PropTypes.object.isRequired,
  reportingLocationConfig: PropTypes.object,
  selectedModule: PropTypes.string,
  selectedRecordType: PropTypes.string,
  setIndexes: PropTypes.func
};

export default Container;
