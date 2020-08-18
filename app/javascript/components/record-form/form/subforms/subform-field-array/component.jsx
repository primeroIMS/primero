import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { getIn } from "formik";
import isEmpty from "lodash/isEmpty";

import SubformFields from "../subform-fields";
import SubformDialog from "../subform-dialog";
import SubformEmptyData from "../subform-empty-data";
import { SUBFORM_FIELD_ARRAY } from "../constants";
import { useThemeHelper } from "../../../../../libs";
import styles from "../styles.css";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";

import { valuesWithDisplayConditions } from "./utils";

const Component = ({ arrayHelpers, field, form, formik, i18n, initialSubformValue, mode, recordType }) => {
  const {
    display_name: displayName,
    name,
    subform_section_configuration: subformSectionConfiguration,
    disabled: isDisabled
  } = field;
  // eslint-disable-next-line camelcase
  const displayConditions = subformSectionConfiguration?.display_conditions;
  const storedValues = getIn(formik.values, name);
  const values = valuesWithDisplayConditions(storedValues, displayConditions);
  const [openDialog, setOpenDialog] = useState({ open: false, index: null });
  const [dialogIsNew, setDialogIsNew] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});
  const { css, mobileDisplay } = useThemeHelper(styles);

  const handleAddSubform = () => {
    setDialogIsNew(true);
    setOpenDialog({ open: true, index: null });
  };
  const { open, index } = openDialog;
  const title = displayName?.[i18n.locale];
  const renderAddText = !mobileDisplay ? i18n.t("fields.add") : null;

  useEffect(() => {
    if (typeof index === "number") {
      setSelectedValue(values[index]);
    }
  }, [index]);

  const renderEmptyData =
    values.filter(currValue => Object.values(currValue).every(isEmpty)).length === values.length ? (
      <SubformEmptyData i18n={i18n} subformName={title} />
    ) : (
      <SubformFields
        arrayHelpers={arrayHelpers}
        field={field}
        values={values}
        locale={i18n.locale}
        mode={mode}
        setOpen={setOpenDialog}
        setDialogIsNew={setDialogIsNew}
        recordType={recordType}
        form={form}
      />
    );

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <div>
          <h3>
            {!mode.isShow && !displayConditions && i18n.t("fields.add")} {title}
          </h3>
        </div>
        <div>
          {!mode.isShow && !isDisabled && (
            <ActionButton
              icon={<AddIcon />}
              text={renderAddText}
              type={ACTION_BUTTON_TYPES.default}
              rest={{
                onClick: handleAddSubform
              }}
            />
          )}
        </div>
      </div>
      {renderEmptyData}
      <SubformDialog
        arrayHelpers={arrayHelpers}
        dialogIsNew={dialogIsNew}
        field={field}
        formik={formik}
        i18n={i18n}
        index={index}
        isFormShow={mode.isShow || isDisabled}
        mode={mode}
        oldValue={!dialogIsNew ? selectedValue : {}}
        open={open}
        setOpen={setOpenDialog}
        title={title}
        initialSubformValue={initialSubformValue}
      />
    </>
  );
};

Component.displayName = SUBFORM_FIELD_ARRAY;

Component.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  initialSubformValue: PropTypes.object.isRequired,
  mode: PropTypes.object.isRequired,
  recordType: PropTypes.string
};

export default Component;
