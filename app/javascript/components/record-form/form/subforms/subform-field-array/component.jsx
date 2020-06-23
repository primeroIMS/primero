import React, { useState } from "react";
import PropTypes from "prop-types";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { getIn } from "formik";
import isEmpty from "lodash/isEmpty";

import SubformFields from "../subform-fields";
import SubformDialog from "../subform-dialog";
import SubformEmptyData from "../subform-empty-data";
import { SUBFORM_FIELD_ARRAY } from "../constants";
import { useThemeHelper } from "../../../../../libs";
import styles from "../styles.css";

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
  const { css, mobileDisplay } = useThemeHelper(styles);

  const handleAddSubform = async () => {
    await arrayHelpers.push(initialSubformValue);
    setDialogIsNew(true);
    setOpenDialog({ open: true, index: null });
  };

  const { open, index } = openDialog;
  const title = displayName?.[i18n.locale];
  const renderAddText = !mobileDisplay ? i18n.t("fields.add") : null;

  const renderEmptyData = isEmpty(values) ? (
    <SubformEmptyData
      handleClick={handleAddSubform}
      i18n={i18n}
      mode={mode}
      subformName={title}
    />
  ) : (
    <>
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

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <div>
          <h3>
            {!mode.isShow && i18n.t("fields.add")} {title}
          </h3>
        </div>
        <div>
          {!mode.isShow && (
            <Fab
              className={css.actionButtonSubform}
              variant="extended"
              onClick={handleAddSubform}
            >
              <AddIcon />
              {renderAddText}
            </Fab>
          )}
        </div>
      </div>
      {renderEmptyData}
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
