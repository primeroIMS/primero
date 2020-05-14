import React, { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Box } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { getIn } from "formik";

import SubformFields from "../subform-fields";
import SubformDialog from "../subform-dialog";
import { SUBFORM_FIELD_ARRAY } from "../constants";

const Component = ({
  arrayHelpers,
  field,
  formik,
  i18n,
  initialSubformValue,
  mode,
  recordType
}) => {
  const { display_name: displayName, name } = field;
  const values = getIn(formik.values, name);
  const [openDialog, setOpenDialog] = useState({ open: false, index: null });
  const [dialogIsNew, setDialogIsNew] = useState(false);

  const handleAddSubform = async () => {
    await arrayHelpers.push(initialSubformValue);
    setDialogIsNew(true);
    setOpenDialog({ open: true, index: null });
  };

  const { open, index } = openDialog;
  const title = displayName?.[i18n.locale];

  return (
    <>
      <Box display="flex" alignItems="center">
        <Box flexGrow={1}>
          <h4>
            {!mode.isShow && i18n.t("fields.add")} {title}
          </h4>
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
        locale={i18n.locale}
        mode={mode}
        setOpen={setOpenDialog}
        setDialogIsNew={setDialogIsNew}
        recordType={recordType}
      />
      <SubformDialog
        index={index !== null ? index : values.length - 1}
        field={field}
        mode={mode}
        open={open}
        setOpen={setOpenDialog}
        title={title}
        dialogIsNew={dialogIsNew}
        i18n={i18n}
        formik={formik}
      />
    </>
  );
};

Component.displayName = SUBFORM_FIELD_ARRAY;

Component.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  initialSubformValue: PropTypes.object.isRequired,
  mode: PropTypes.object.isRequired,
  recordType: PropTypes.string
};

export default Component;
