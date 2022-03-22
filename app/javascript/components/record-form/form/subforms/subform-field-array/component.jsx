import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getIn } from "formik";
import clsx from "clsx";
import { List } from "@material-ui/core";

import SubformFields from "../subform-fields";
import SubformEmptyData from "../subform-empty-data";
import SubformItem from "../subform-item";
import SubformAddEntry from "../subform-add-entry";
import { SUBFORM_FIELD_ARRAY } from "../constants";
import { VIOLATIONS_ASSOCIATIONS_FORM } from "../../../../../config";
import css from "../styles.css";
import { isViolationSubform } from "../../utils";
import { GuidingQuestions } from "../../components";

import { isEmptyOrAllDestroyed, isTracesSubform } from "./utils";

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
  forms,
  parentTitle,
  parentValues,
  violationOptions,
  renderAsAccordion = false
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

  const { open, index } = openDialog;
  const title = displayName?.[i18n.locale];

  const isTraces = isTracesSubform(recordType, formSection);

  const isViolation = isViolationSubform(recordType, formSection.unique_id, true);
  const isViolationAssociation = VIOLATIONS_ASSOCIATIONS_FORM.includes(formSection.unique_id);
  const renderAddFieldTitle = !isViolation && !mode.isShow && !displayConditions && i18n.t("fields.add");

  const cssContainer = clsx(css.subformFieldArrayContainer, {
    [css.subformFieldArrayAccordion]: renderAsAccordion && mode.isShow,
    [css.subformFieldArrayShow]: renderAsAccordion && !mode.isShow
  });

  useEffect(() => {
    if (typeof index === "number") {
      setSelectedValue(orderedValues[index]);
    }
  }, [index]);

  const renderEmptyData = isEmptyOrAllDestroyed(orderedValues) ? (
    <SubformEmptyData subformName={title} />
  ) : (
    <List dense={renderAsAccordion} classes={{ root: css.list }} disablePadding>
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
        isViolationAssociation={isViolationAssociation}
        formik={formik}
        parentForm={form}
      />
    </List>
  );

  const renderGuidingQuestions = guidingQuestions && guidingQuestions[i18n.locale] && (mode.isEdit || mode.isNew) && (
    <div className={css.subformGuidance}>
      <GuidingQuestions label={i18n.t("buttons.guidance")} text={guidingQuestions[i18n.locale]} />
    </div>
  );

  return (
    <div className={css.fieldArray}>
      <div className={cssContainer}>
        {!renderAsAccordion && (
          <div>
            <h3 className={css.subformTitle}>
              {renderAddFieldTitle} {title} {parentTitle}
            </h3>
          </div>
        )}
        <SubformAddEntry
          field={field}
          formik={formik}
          mode={mode}
          formSection={formSection}
          isReadWriteForm={isReadWriteForm}
          isDisabled={isDisabled}
          setOpenDialog={setOpenDialog}
          setDialogIsNew={setDialogIsNew}
          isViolationAssociation={isViolationAssociation}
          parentTitle={parentTitle}
          parentValues={parentValues}
          arrayHelpers={arrayHelpers}
        />
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
        isViolationAssociation={isViolationAssociation}
        mode={mode}
        selectedValue={selectedValue}
        open={open}
        orderedValues={orderedValues}
        recordModuleID={recordModuleID}
        recordType={recordType}
        setOpen={setOpenDialog}
        title={title}
        parentTitle={parentTitle}
        violationOptions={violationOptions}
      />
    </div>
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
  parentTitle: PropTypes.string,
  parentValues: PropTypes.object,
  recordModuleID: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  renderAsAccordion: PropTypes.bool,
  violationOptions: PropTypes.array
};

export default Component;
