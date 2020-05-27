import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  Typography
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ArrowIcon from "@material-ui/icons/KeyboardArrowRight";

import { useI18n } from "../../../i18n";
import { FormSectionField, FieldRecord, TEXT_FIELD } from "../../../form";

import { NAME } from "./constants";
import styles from "./styles.css";

const Container = ({ attributes, defaultFilters, formMode, methods }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const [indexes, setIndexes] = useState(defaultFilters.map((d, i) => i));

  console.log(
    NAME,
    indexes,
    methods.getValues().filters?.map((d, i) => i)
  );

  // if (!attributes.length) {
  //   return null;
  // }

  const handleDelete = index => setIndexes(indexes.filter(i => i !== index));

  const handleEdit = () => console.log("Edit field");

  return (
    <>
      <Typography className={css.filtersHeading}>
        {i18n.t("report.filters.label")}
        <IconButton
          size="small"
          onClick={() => setIndexes([...indexes, indexes.length])}
          className={css.addFilter}
        >
          <AddIcon />
          New
        </IconButton>
      </Typography>
      {indexes.map(index => {
        const fieldName = `filters[${index}]`;

        // const { attribute, constraint, value } = defaultFilters[index];
        // const filterDisplayName = [
        //   attribute,
        //   "is",
        //   constraint,
        //   value.join(", ")
        // ].join(" ");

        return (
          <Grid container spacing={1} className={css.row}>
            <Grid container item xs={3}>
              <FormSectionField
                field={FieldRecord({
                  name: `${fieldName}.attribute`,
                  type: TEXT_FIELD
                })}
              />
            </Grid>
            <Grid container item xs={3}>
              <FormSectionField
                field={FieldRecord({
                  name: `${fieldName}.constraint`,
                  type: TEXT_FIELD
                })}
              />
            </Grid>
            <Grid container item xs={3}>
              <FormSectionField
                field={FieldRecord({
                  name: `${fieldName}.value`,
                  type: TEXT_FIELD
                })}
              />
            </Grid>
            <Grid container item xs={2} justify="flex-end">
              <IconButton onClick={() => handleDelete(index)}>
                <DeleteIcon />
              </IconButton>
              {/* <IconButton onClick={() => handleEdit(index)}>
                <ArrowIcon />
              </IconButton> */}
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  attributes: PropTypes.object,
  defaultFilters: PropTypes.array,
  formMode: PropTypes.object,
  methods: PropTypes.object
};

export default Container;
