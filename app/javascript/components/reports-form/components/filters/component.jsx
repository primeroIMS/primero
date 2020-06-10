import React, { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Box, IconButton, makeStyles, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ArrowIcon from "@material-ui/icons/KeyboardArrowRight";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../i18n";
import { DATE_FIELD } from "../../../form";
import FiltersDialog from "../filters-dialog";
import { CONSTRAINTS, MODULES_FIELD, RECORD_TYPE_FIELD } from "../../constants";
import { formattedFields } from "../../utils";
import { compare, dataToJS } from "../../../../libs";
import { getOptions } from "../../../record-form/selectors";
import { getOptions as specialOptions } from "../../../form/selectors";
import { OPTION_TYPES, NUMERIC_FIELD } from "../../../form/constants";

import { NAME } from "./constants";
import styles from "./styles.css";
import { registerValues, formatValue } from "./utils";

const Container = ({
  indexes,
  setIndexes,
  allRecordForms,
  parentFormMethods
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
        ? { ...currentReportFilter, value: formatValue(new Date(), i18n, {}) }
        : currentReportFilter;

    if (
      [DATE_FIELD, NUMERIC_FIELD].includes(currentField.type) &&
      currentReportFilter.constraint === "not_null"
    ) {
      data.value = "";
    }

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

  const allLookups = useSelector(state => getOptions(state), compare);
  const location = useSelector(
    state => specialOptions(state, OPTION_TYPES.LOCATION, i18n),
    compare
  );
  const agencies = useSelector(
    state => specialOptions(state, OPTION_TYPES.AGENCY, i18n),
    compare
  );
  const modules = useSelector(
    state => specialOptions(state, OPTION_TYPES.MODULE, i18n),
    compare
  );
  const formGroups = useSelector(
    state => specialOptions(state, OPTION_TYPES.FORM_GROUP, i18n),
    compare
  );

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

  const handleDelete = index => {
    setIndexes([
      ...indexes.slice(0, parseInt(index, 10)),
      ...indexes.slice(parseInt(index, 10) + 1, indexes.length)
    ]);
  };

  if (isEmpty(indexes)) {
    return <>{i18n.t("report.no_filters_added")}</>;
  }

  const renderReportFilterList = () =>
    Object.entries(indexes).map(filter => {
      const [index, { data }] = filter;
      const { attribute, constraint, value } = data;
      const constraintLabel =
        // eslint-disable-next-line no-nested-ternary
        constraint && typeof constraint === "boolean"
          ? i18n.t(CONSTRAINTS.not_null)
          : CONSTRAINTS[constraint]
          ? i18n.t(CONSTRAINTS[constraint])
          : "";
      const field = fields.find(f => f.id === attribute);
      const lookups = [
        ...dataToJS(allLookups),
        ...[{ unique_id: OPTION_TYPES.LOCATION, values: dataToJS(location) }],
        ...[{ unique_id: OPTION_TYPES.AGENCY, values: dataToJS(agencies) }],
        ...[{ unique_id: OPTION_TYPES.MODULE, values: dataToJS(modules) }],
        ...[
          { unique_id: OPTION_TYPES.FORM_GROUP, values: dataToJS(formGroups) }
        ]
      ];

      const formattedReportFilterName = [
        // eslint-disable-next-line camelcase
        field?.display_text || "",
        i18n.t("report.filters.is"),
        constraintLabel,
        formatValue(value, i18n, { field, lookups })
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
    });

  return (
    <>
      <Typography className={css.filtersHeading}>
        {i18n.t("report.filters.label")}
        <IconButton size="small" onClick={handleNew} className={css.addFilter}>
          <AddIcon />
          {i18n.t("buttons.new")}
        </IconButton>
      </Typography>

      {renderReportFilterList()}

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
  setIndexes: PropTypes.func
};

export default Container;
