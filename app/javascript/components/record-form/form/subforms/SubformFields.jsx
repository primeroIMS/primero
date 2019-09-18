/* eslint-disable */
import React, { useState } from "react";
import { sortBy } from "lodash";
import { Box, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowIcon from "@material-ui/icons/KeyboardArrowRight";

const SubformFields = ({
  arrayHelpers,
  field,
  values,
  locale,
  mode,
  setOpen
}) => {
  const {
    subform_sort_by: subformSortBy,
    display_name: displayName,
    subform_prevent_item_removal: subformPreventItemRemoval,
    name
  } = field;

  const { isShow, isEdit } = mode;

  const handleDelete = index => {
    if (isEdit) {
      values[index]._destroy = true;
      const uniqueId = values?.[index]?.unique_id;

      if (uniqueId) {
        let updatedData = name || [];
        updatedData = [
          ...updatedData,
          {
            _destroy: true,
            unique_id: uniqueId
          }
        ];
        setSubformFields({
          ...subformFields,
          [formName]: updatedData
        });
      }
    }

    arrayHelpers.remove(index);
  };

  const handleEdit = index => {
    setOpen({ open: true, index });
  };

  if (values && values.length > 0) {
    let sortedValues = [];

    if (subformSortBy) {
      sortedValues = sortBy(values, v => {
        let criteria;
        if (!Number.isNaN(Date.parse(v[subformSortBy]))) {
          criteria = new Date(v[subformSortBy]);
        } else {
          criteria = subformSortBy;
        }
        return criteria;
      });
    } else {
      sortedValues = values;
    }

    return (
      <>
        {sortedValues.map((c, index) => {
          return (
            <Box key={`${name}-${index}`} display="flex">
              <Box flexGrow={1}>{displayName?.[locale]}</Box>
              <Box>
                {!subformPreventItemRemoval || mode.isNew ? (
                  <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
                <IconButton onClick={() => handleEdit(index)}>
                  <ArrowIcon />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </>
    );
  }

  return null;
};

export default SubformFields;
