import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { getIn } from "formik";
import isEmpty from "lodash/isEmpty";

import SubformFields from "../subform-fields";
import SubformEmptyData from "../subform-empty-data";
import SubformItem from "../subform-item";
import { SUBFORM_FIELD_ARRAY } from "../constants";
import { useThemeHelper } from "../../../../../libs";
import css from "../styles.css";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import { isViolationSubform } from "../../utils";
import { GuidingQuestions } from "../../components";

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
  isReadWriteForm,
  forms
}) => {
  const {
    display_name: displayName,
    name,
    subform_section_configuration: subformSectionConfiguration,
    disabled: isDisabled,
    guiding_questions: guidingQuestions
  } = field;
  // eslint-disable-next-line camelcase
  const displayConditions = subformSectionConfiguration?.display_conditions;

  const orderedValues = getIn(formik.values, name);

  const [openDialog, setOpenDialog] = useState({ open: false, index: null });
  const [dialogIsNew, setDialogIsNew] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});
  const { mobileDisplay } = useThemeHelper();

  const handleAddSubform = e => {
    e.stopPropagation();
    setDialogIsNew(true);
    setOpenDialog({ open: true, index: null });
  };
  const { open, index } = openDialog;
  const title = displayName?.[i18n.locale];
  const renderAddText = !mobileDisplay ? i18n.t("fields.add") : null;

  const isTraces = isTracesSubform(recordType, formSection);
  const isViolation = isViolationSubform(recordType, formSection.unique_id, true);
  const renderAddFieldTitle = !isViolation && !mode.isShow && !displayConditions && i18n.t("fields.add");

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
        isViolationSubform={isViolation}
        formik={formik}
        parentForm={form}
      />
    );

  const renderGuidingQuestions = guidingQuestions && guidingQuestions[i18n.locale] && (mode.isEdit || mode.isNew) && (
    <div className={css.subformGuidance}>
      <GuidingQuestions label={i18n.t("buttons.guidance")} text={guidingQuestions[i18n.locale]} />
    </div>
  );

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <div>
          <h3 className={css.subformTitle}>
            {renderAddFieldTitle} {title}
          </h3>
        </div>
        <div>
          {!mode.isShow && !isDisabled && isReadWriteForm && (
            <ActionButton
              id="fields.add"
              icon={<AddIcon />}
              text={renderAddText}
              type={ACTION_BUTTON_TYPES.default}
              noTranslate
              rest={{
                onClick: handleAddSubform
              }}
            />
          )}
        </div>
      </div>
      {renderGuidingQuestions}
      {renderEmptyData}
      <SubformItem
        arrayHelpers={arrayHelpers}
        dialogIsNew={dialogIsNew}
        field={field}
        formik={formik}
        forms={forms}
        formSection={formSection}
        index={index}
        isDisabled={isDisabled}
        isTraces={isTraces}
        isReadWriteForm={isReadWriteForm}
        isViolation={isViolation}
        mode={mode}
        selectedValue={selectedValue}
        open={open}
        orderedValues={orderedValues}
        recordModuleID={recordModuleID}
        recordType={recordType}
        setOpen={setOpenDialog}
        title={title}
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
  forms: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  isReadWriteForm: PropTypes.bool,
  mode: PropTypes.object.isRequired,
  recordModuleID: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired
};

export default Component;
