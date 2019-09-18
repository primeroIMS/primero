/* eslint-disable */
import React, { useState } from "react";
import { IconButton, Box } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SubformFields from "./SubformFields";
import { getIn } from "formik";
import SubformDialog from "./SubformDialog";

const SubformFieldArray = ({
  arrayHelpers,
  mode,
  initialSubformValue,
  field,
  locale,
  formik
}) => {
  const { display_name: displayName, name } = field;
  const values = getIn(formik.values, name);
  const [openDialog, setOpenDialog] = useState({ open: false, index: null });

  const handleAddSubform = async () => {
    await arrayHelpers.push(initialSubformValue);
    setOpenDialog({ open: true, index: null });
  };

  const { open, index } = openDialog;

  return (
    <>
      <Box display="flex">
        <Box flexGrow={1}>
          <h4>{displayName?.[locale]}</h4>
        </Box>
        <Box>
          {!mode.isShow && (
            <IconButton
              size="medium"
              variant="contained"
              onClick={handleAddSubform}
            >
              <AddIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <SubformFields
        arrayHelpers={arrayHelpers}
        field={field}
        values={values}
        locale={locale}
        mode={mode}
        setOpen={setOpenDialog}
      />
      <SubformDialog
        index={index || values.length - 1}
        field={field}
        mode={mode}
        open={open}
        setOpen={setOpenDialog}
      />
    </>
  );
};

export default SubformFieldArray;
