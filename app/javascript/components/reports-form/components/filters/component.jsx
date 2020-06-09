import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Box, IconButton, makeStyles, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ArrowIcon from "@material-ui/icons/KeyboardArrowRight";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../i18n";
import {
  FormSectionField,
  FieldRecord,
  SELECT_FIELD,
  TEXT_FIELD,
  DATE_FIELD
} from "../../../form";
import FiltersDialog from "../filters-dialog";
import {
  CONSTRAINTS,
  DEFAULT_FILTERS,
  MODULES_FIELD,
  RECORD_TYPE_FIELD,
  FILTERS_FIELD
} from "../../constants";
import { formattedFields } from "../../utils";

import { NAME } from "./constants";
import styles from "./styles.css";
import { registerValues, formatValue } from "./utils";

const Container = ({
  indexes,
  setIndexes,
  allRecordForms,
  parentFormMethods,
  selectedReport
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [open, setOpen] = useState(false);

  const onSuccess = (index, currentReportFilter, currentField) => {
    const data =
      currentField.type === DATE_FIELD &&
      Array.isArray(currentReportFilter.value) &&
      isEmpty(currentReportFilter.value)
        ? { ...currentReportFilter, value: [formatValue(new Date())] }
        : currentReportFilter;

    if (Object.is(index, null)) {
      setIndexes([...indexes, { index: indexes.length, data }]);
      registerValues(indexes.length, data, indexes, parentFormMethods);
    } else {
      const indexesCopy = [...indexes].slice();

      indexesCopy[index] = { ...indexesCopy[index], data };

      setIndexes(indexesCopy);
      registerValues(index, data, indexes, parentFormMethods);
    }
  };

  const selectedModules = parentFormMethods.getValues()[MODULES_FIELD];
  const selectedRecordType = parentFormMethods.getValues()[RECORD_TYPE_FIELD];

  const fields = formattedFields(
    allRecordForms,
    selectedModules,
    selectedRecordType,
    i18n.locale
  );

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

  // TODO: OnSuccess here!!
  const handleDelete = index => {
    setIndexes([
      ...indexes.slice(0, parseInt(index, 10)),
      ...indexes.slice(parseInt(index, 10) + 1, indexes.length)
    ]);
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
      {isEmpty(indexes) ? (
        <> {i18n.t("report.no_filters_added")} </>
      ) : (
        Object.entries(indexes).map(filter => {
          const [index, { data }] = filter;
          const { attribute, constraint, value } = data;

          const formattedReportFilterName = [
            fields.find(f => f.id === attribute)?.display_text || "",
            "is",
            typeof constraint === "boolean" && constraint
              ? CONSTRAINTS.not_null
              : CONSTRAINTS[constraint],
            formatValue(value)
          ].join(" ");

          return (
            <Box key={index} display="flex" alignItems="center">
              <Box flexGrow={1}>{formattedReportFilterName}</Box>
              <Box>
                <IconButton onClick={() => handleDelete(index)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => handleEdit(index)}>
                  <ArrowIcon />
                </IconButton>
              </Box>
            </Box>
          );
        })
      )}

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
  indexes: PropTypes.array,
  parentFormMethods: PropTypes.object.isRequired,
  selectedReport: PropTypes.object,
  setIndexes: PropTypes.func
};

export default Container;
