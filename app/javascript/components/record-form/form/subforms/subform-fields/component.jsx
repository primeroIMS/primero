/* eslint-disable  react/no-array-index-key */
import React from "react";
import PropTypes from "prop-types";
import { sortBy } from "lodash";
import { Box, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowIcon from "@material-ui/icons/KeyboardArrowRight";

import SubformMenu from "../subform-menu";
import SubformHeader from "../subform-header";
import { SUBFORM_FIELDS } from "../constants";
import { serviceHasReferFields } from "../../utils";

const Component = ({
  arrayHelpers,
  field,
  locale,
  mode,
  setDialogIsNew,
  setOpen,
  values
}) => {
  const {
    subform_sort_by: subformSortBy,
    display_name: displayName,
    subform_prevent_item_removal: subformPreventItemRemoval,
    name
  } = field;

  const { isEdit, isNew } = mode;

  const handleDelete = index => {
    if (isEdit || isNew) {
      // eslint-disable-next-line camelcase
      const uniqueId = values?.[index]?.unique_id;

      if (uniqueId) {
        arrayHelpers.replace(index, { _destroy: true, unique_id: uniqueId });
      } else {
        arrayHelpers.remove(index);
      }
    }
  };

  const handleEdit = index => {
    setDialogIsNew(false);
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
          if (values?.[index]?._destroy) return false;

          return (
            <Box key={`${name}-${index}`} display="flex" alignItems="center">
              <Box flexGrow={1}>
                <SubformHeader
                  field={field}
                  index={index}
                  displayName={displayName}
                  locale={locale}
                  values={values}
                />
              </Box>
              <Box>
                {!subformPreventItemRemoval && !mode.isShow ? (
                  <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
                {mode.isShow && serviceHasReferFields(values[index]) ? (
                  <SubformMenu index={index} values={values} />
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

Component.displayName = SUBFORM_FIELDS;

Component.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  mode: PropTypes.object.isRequired,
  setDialogIsNew: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired
};

export default Component;
