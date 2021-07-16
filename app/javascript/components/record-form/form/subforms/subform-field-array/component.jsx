import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { getIn } from "formik";
import isEmpty from "lodash/isEmpty";

import SubformTraces from "../subform-traces";
import SubformFields from "../subform-fields";
import SubformDialog from "../subform-dialog";
import SubformEmptyData from "../subform-empty-data";
import { SUBFORM_FIELD_ARRAY } from "../constants";
import { useThemeHelper } from "../../../../../libs";
import styles from "../styles.css";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";

import { isTracesSubform } from "./utils";

const Component = ({
  arrayHelpers,
  field,
  formik,
  i18n,
  mode,
  formSection,
  recordModuleID,
  recordType,
  form,
  isReadWriteForm
}) => {
  const {
    display_name: displayName,
    name,
    subform_section_configuration: subformSectionConfiguration,
    disabled: isDisabled
  } = field;
  // eslint-disable-next-line camelcase
  const displayConditions = subformSectionConfiguration?.display_conditions;

  const orderedValues = getIn(formik.values, name);

  const [openDialog, setOpenDialog] = useState({ open: false, index: null });
  const [dialogIsNew, setDialogIsNew] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});
  const { css, mobileDisplay } = useThemeHelper({ css: styles });

  const handleAddSubform = e => {
    e.stopPropagation();
    setDialogIsNew(true);
    setOpenDialog({ open: true, index: null });
  };
  const { open, index } = openDialog;
  const title = displayName?.[i18n.locale];
  const renderAddText = !mobileDisplay ? i18n.t("fields.add") : null;

  const isTraces = isTracesSubform(recordType, formSection);
  const handleCloseSubformTraces = () => setOpenDialog(false);

  useEffect(() => {
    if (typeof index === "number") {
      setSelectedValue(orderedValues[index]);
    }
  }, [index]);

  const renderEmptyData =
    orderedValues?.filter(currValue => Object.values(currValue).every(isEmpty))?.length === orderedValues?.length ? (
      <SubformEmptyData i18n={i18n} subformName={title} />
    ) : (
      <SubformFields
        arrayHelpers={arrayHelpers}
        field={field}
        values={orderedValues}
        locale={i18n.locale}
        mode={mode}
        setOpen={setOpenDialog}
        setDialogIsNew={setDialogIsNew}
        form={formSection}
        recordType={recordType}
        isTracesSubform={isTraces}
        formik={formik}
        parentForm={form}
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
          {!mode.isShow && !isDisabled && isReadWriteForm && (
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
      {isTraces && mode.isShow ? (
        <SubformTraces
          formSection={formSection}
          openDrawer={open}
          handleClose={handleCloseSubformTraces}
          field={field}
          formik={formik}
          index={index}
          recordType={recordType}
          mode={mode}
        />
      ) : (
        <SubformDialog
          arrayHelpers={arrayHelpers}
          dialogIsNew={dialogIsNew}
          field={field}
          formik={formik}
          i18n={i18n}
          index={index}
          isFormShow={mode.isShow || isDisabled || isReadWriteForm === false}
          mode={mode}
          oldValue={!dialogIsNew ? selectedValue : {}}
          open={open}
          setOpen={setOpenDialog}
          title={title}
          formSection={formSection}
          isReadWriteForm={isReadWriteForm}
          orderedValues={orderedValues}
          recordType={recordType}
          recordModuleID={recordModuleID}
        />
      )}
    </>
  );
};

Component.displayName = SUBFORM_FIELD_ARRAY;

Component.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  isReadWriteForm: PropTypes.bool,
  mode: PropTypes.object.isRequired,
  recordModuleID: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired
};

export default Component;
