// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getIn } from "formik";
import { cx } from "@emotion/css";
import { List } from "@mui/material";

import SubformFields from "../subform-fields";
import SubformEmptyData from "../subform-empty-data";
import SubformAddEntry from "../subform-add-entry";
import { SUBFORM_FIELD_ARRAY } from "../constants";
import { VIOLATIONS_ASSOCIATIONS_FORM } from "../../../../../config";
import css from "../styles.css";
import { isFamilyDetailSubform, isFamilyMemberSubform, isViolationSubform } from "../../utils";
import { GuidingQuestions } from "../../components";
import ChildFunctioningSummary from "../../../../child-functioning-summary";

import { isEmptyOrAllDestroyed, isTracesSubform } from "./utils";

function Component({
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
  renderAsAccordion = false,
  entryFilter = false,
  customTitle = false,
  components
}) {
  const {
    display_name: displayName,
    name,
    subform_section_configuration: subformSectionConfiguration,
    disabled: isDisabled,
    guiding_questions: guidingQuestions,
    subform_section_id: subformSectionId
  } = field;
  // eslint-disable-next-line camelcase
  const displayConditions = subformSectionConfiguration?.display_conditions;

  const orderedValues = getIn(formik.values, name);

  const [openDialog, setOpenDialog] = useState({ open: false, index: null });
  const [dialogIsNew, setDialogIsNew] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});

  const { open, index } = openDialog;

  const title = customTitle || displayName?.[i18n.locale] || displayName?.[i18n.defaultLocale];

  const isTraces = isTracesSubform(recordType, formSection);

  const isFamilyDetail = isFamilyDetailSubform(recordType, formSection.unique_id);
  const isFamilyMember = isFamilyMemberSubform(recordType, formSection.unique_id);
  const isViolation = isViolationSubform(recordType, formSection.unique_id, true);
  const isViolationAssociation = VIOLATIONS_ASSOCIATIONS_FORM.includes(formSection.unique_id);
  const renderAddFieldTitle = !isViolation && !mode.isShow && !displayConditions && i18n.t("fields.add");

  const cssContainer = cx(css.subformFieldArrayContainer, {
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
        entryFilter={entryFilter}
        parentTitle={parentTitle}
        isFamilyMember={isFamilyMember}
        isFamilyDetail={isFamilyDetail}
        isReadWriteForm={isReadWriteForm}
      />
    </List>
  );

  const renderGuidingQuestions = guidingQuestions && guidingQuestions[i18n.locale] && (mode.isEdit || mode.isNew) && (
    <div className={css.subformGuidance}>
      <GuidingQuestions label={i18n.t("buttons.guidance")} text={guidingQuestions[i18n.locale]} />
    </div>
  );

  const getlatestValue = arr => arr?.[0] ?? null;
  const latestValue = getlatestValue(orderedValues);

  return (
    <div className={css.fieldArray} data-testid="subform-field-array">
      {/* Conditionally Render Child Functioning Subform Summary */}
      {subformSectionId.unique_id === "child_functioning_subform_section" && (
        <ChildFunctioningSummary values={latestValue} />
      )}
      <div className={cssContainer}>
        {!renderAsAccordion && (
          <div data-testid="subForm-header">
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
      <components.SubformItem
        components={components}
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
        isFamilyMember={isFamilyMember}
        isFamilyDetail={isFamilyDetail}
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
}

Component.displayName = SUBFORM_FIELD_ARRAY;

Component.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  components: PropTypes.objectOf({
    SubformItem: PropTypes.elementType.isRequired,
    SubformDialog: PropTypes.elementType.isRequired,
    SubformDialogFields: PropTypes.elementType.isRequired,
    SubformFieldSubform: PropTypes.elementType.isRequired,
    SubformField: PropTypes.elementType.isRequired
  }),
  customTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  entryFilter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
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
