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
  TEXT_FIELD
} from "../../../form";
import FiltersDialog from "../filters-dialog";

import { NAME } from "./constants";
import styles from "./styles.css";

const Container = ({ fields, defaultFilters, methods, onSuccess }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const [indexes, setIndexes] = useState(
    defaultFilters.map((d, i) => ({ index: i, data: d }))
  );
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [open, setOpen] = useState(false);

  if (!fields.length) {
    return null;
  }

  const handleNew = () => {
    setOpen(true);
  };

  const handleEdit = index => {
    console.log(indexes);
    setSelectedIndex(index.toString());
    setOpen(true);
  };

  const handleDelete = index =>
    setIndexes(indexes.filter(i => i.index.toString() !== index));

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
        <> No filters added </>
      ) : (
        Object.entries(indexes).map(filter => {
          const [index, { data }] = filter;
          // const { attribute, constraint, value } = defaultFilters[index];
          // const filterDisplayName = [
          //   attribute,
          //   "is",
          //   constraint,
          //   value.join(", ")
          // ].join(" ");

          return (
            <Box key={index} display="flex" alignItems="center">
              <Box flexGrow={1}>{`${index}/${JSON.stringify(data)}`}</Box>
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
        setIndexes={() => console.log(methods.getValues())}
        fields={fields}
        methods={methods}
        onSuccess={onSuccess}
      />
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  defaultFilters: PropTypes.array,
  fields: PropTypes.object,
  methods: PropTypes.object,
  onSuccess: PropTypes.func
};

export default Container;
