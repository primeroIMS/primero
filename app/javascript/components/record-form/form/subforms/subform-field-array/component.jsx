import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { getIn } from "formik";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";

import SubformTraces from "../subform-traces";
import SubformFields from "../subform-fields";
import SubformDialog from "../subform-dialog";
import SubformEmptyData from "../subform-empty-data";
import { SUBFORM_FIELD_ARRAY } from "../constants";
import { useThemeHelper } from "../../../../../libs";
import styles from "../styles.css";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import { getSubformValues } from "../../utils";

import { isTracesSubform, valuesWithDisplayConditions } from "./utils";

const Component = ({ arrayHelpers, field, formik, i18n, mode, formSection, recordType }) => {
  const {
    display_name: displayName,
    name,
    subform_section_configuration: subformSectionConfiguration,
    disabled: isDisabled
  } = field;
  // eslint-disable-next-line camelcase
  const displayConditions = subformSectionConfiguration?.display_conditions;
  // eslint-disable-next-line camelcase
  const subformSortBy = subformSectionConfiguration?.subform_sort_by;
  const storedValues = getIn(formik.values, name);
  const values = valuesWithDisplayConditions(storedValues, displayConditions);

  const orderedValues = subformSortBy ? orderBy(values, [subformSortBy], ["asc"]) : values;

  useEffect(() => {
    formik.resetForm({ ...formik.values, [name]: orderedValues });
  }, [JSON.stringify(orderedValues)]);

  const [openDialog, setOpenDialog] = useState({ open: false, index: null });
  const [dialogIsNew, setDialogIsNew] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});
  const { css, mobileDisplay } = useThemeHelper({ css: styles });

  const handleAddSubform = () => {
    setDialogIsNew(true);
    setOpenDialog({ open: true, index: null });
  };
  const { open, index } = openDialog;
  const title = displayName?.[i18n.locale];
  const renderAddText = !mobileDisplay ? i18n.t("fields.add") : null;

  const initialValues = getSubformValues(field, index, formik.values);

  const isTraces = isTracesSubform(recordType, formSection);

  useEffect(() => {
    if (typeof index === "number") {
      setSelectedValue(orderedValues[index]);
    }
  }, [index]);

  const renderEmptyData =
    orderedValues.filter(currValue => Object.values(currValue).every(isEmpty)).length === orderedValues.length ? (
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
      {isTraces && mode.isShow ? (
        <SubformTraces
          formSection={formSection}
          openDrawer={open}
          handleClose={() => setOpenDialog(false)}
          initialValues={initialValues}
        />
      ) : (
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
          formSection={formSection}
        />
      )}
    </>
  );
};

Component.displayName = SUBFORM_FIELD_ARRAY;

Component.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  mode: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired
};

export default Component;
