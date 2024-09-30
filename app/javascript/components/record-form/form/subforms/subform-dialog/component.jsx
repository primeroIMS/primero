// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp, react/display-name */
import { useState, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Formik, Form, getIn } from "formik";
import { object } from "yup";
import isEmpty from "lodash/isEmpty";
import { useDispatch } from "react-redux";

import { fieldValidations } from "../../validations";
import { SUBFORM_CREATE_CASE_DIALOG, SUBFORM_DIALOG } from "../constants";
import SubformMenu from "../subform-menu";
import {
  getSubformValues,
  serviceHasReferFields,
  updateSubformEntries,
  addSubformEntries,
  serviceFilterFunc
} from "../../utils";
import ActionDialog, { useDialog } from "../../../../action-dialog";
import SubformDrawer from "../subform-drawer";
import { compactValues, constructInitialValues } from "../../../utils";
import SubformErrors from "../subform-errors";
import SubformDrawerActions from "../subform-drawer-actions";
import ViolationTitle from "../subform-fields/components/violation-title";
import uuid from "../../../../../libs/uuid";
import { useApp } from "../../../../application";
import SubformLink from "../subform-link/component";
import DefaultEditActions from "../subform-drawer-actions/components/default-edit-actions";
import FamilySubformActions from "../subform-drawer-actions/components/family-subform-actions";
import {
  createCaseFromFamilyDetail,
  createCaseFromFamilyMember,
  getCaseFormFamilyMemberLoading
} from "../../../../records";
import { useMemoizedSelector } from "../../../../../libs";
import { RECORD_TYPES_PLURAL, SERVICES_SUBFORM_FIELD } from "../../../../../config";

function Component({
  arrayHelpers,
  dialogIsNew,
  field,
  formik,
  formSection,
  i18n,
  index,
  isFormShow,
  mode,
  oldValue,
  open,
  setOpen,
  title,
  isReadWriteForm,
  orderedValues,
  recordType,
  recordModuleID,
  parentTitle,
  isFamilyDetail,
  isFamilyMember,
  isViolation,
  isViolationAssociation,
  violationOptions,
  components
}) {
  const { online } = useApp();
  const params = useParams();
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({});
  const [filterState, setFilterState] = useState({
    filtersChanged: false,
    userIsSelected: false
  });
  const { dialogOpen, setDialog } = useDialog(SUBFORM_CREATE_CASE_DIALOG);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const caseFromFamilyMemberLoading = useMemoizedSelector(state => getCaseFormFamilyMemberLoading(state, recordType));
  const childFormikRef = useRef();
  const isValidIndex = index === 0 || index > 0;
  const asDrawer = isViolation || isViolationAssociation || isFamilyMember || isFamilyDetail;
  const isFamilySubform = isFamilyMember || isFamilyDetail;
  const familyHandleBackLabel = isFamilyMember
    ? "family.family_member.back_to_family_members"
    : "case.back_to_family_details";
  const familyCreateLabel = isFamilyMember ? "family.family_member.create_case" : "case.create_case";

  const subformValues = getSubformValues(field, index, formik.values, orderedValues, isViolation);

  const initialSubformValues = isEmpty(subformValues) ? initialValues : subformValues;

  const isNewSubform = isEmpty(subformValues);

  const initialSubformErrors = isValidIndex ? getIn(formik.errors, `${field.name}[${index}]`) : {};

  const buildSchema = () => {
    const subformSchema = field.subform_section_id.fields.map(sf => fieldValidations(sf, { i18n, online }));

    return object().shape(Object.assign({}, ...subformSchema));
  };

  const { case_id: caseId, case_id_display: caseIdDisplay } = subformValues;

  const handleClose = () => {
    const compactedValues = compactValues(childFormikRef.current.values, initialSubformValues);

    if (Object.keys(childFormikRef.current.touched).length || Object.keys(compactedValues).length) {
      setOpenConfirmationModal(true);
    } else {
      setOpen({ open: false, index: null });
    }
  };

  let boundSubmitForm = null;

  const bindSubmitForm = submitForm => {
    boundSubmitForm = submitForm;
  };

  const onSubmit = values => {
    // eslint-disable-next-line camelcase
    const valuesWithUniqueId = { ...values, ...(!values?.unique_id ? { unique_id: uuid.v4() } : {}) };

    if (isValidIndex) {
      updateSubformEntries(formik, field.name, index, valuesWithUniqueId, isViolation);
    } else {
      addSubformEntries(formik, arrayHelpers, { ...initialSubformValues, ...valuesWithUniqueId }, isViolation);
      formik.setTouched({ [field.name]: true });
    }

    // Trigger validations only if the form was already submitted.
    if (formik.submitCount) {
      formik.validateForm();
    }

    setOpen({ open: false, index: null });
  };

  const buttonDialogText = dialogIsNew ? "buttons.add" : "buttons.update";

  const dialogActions =
    field.name === SERVICES_SUBFORM_FIELD &&
    mode.isShow &&
    // eslint-disable-next-line camelcase
    serviceHasReferFields(formik.values?.services_section?.[index]) ? (
      <SubformMenu index={index} values={formik.values.services_section} />
    ) : null;

  const subformFieldProps = {
    mode,
    parentTitle: title,
    parentViolationOptions: violationOptions,
    isViolationAssociation,
    isViolation,
    arrayHelpers
  };

  const defaultSubformFieldProps = {
    components,
    formSection,
    isReadWriteForm,
    recordType,
    recordModuleID,
    parentValues: formik.values
  };

  const serviceSubformFieldProps = {
    mode:
      isReadWriteForm === false
        ? {
            isShow: true,
            isEdit: false,
            isNew: false
          }
        : mode,
    filterState,
    setFilterState,
    filterFunc: serviceFilterFunc
  };

  const modalConfirmationProps = {
    open: openConfirmationModal,
    maxSize: "xs",
    confirmButtonLabel: i18n.t("buttons.ok"),
    dialogTitle: title,
    dialogText: i18n.t("messages.confirmation_message_subform"),
    cancelHandler: () => setOpenConfirmationModal(false),
    successHandler: () => {
      arrayHelpers.replace(index, oldValue);
      setOpen({ open: false, index: null });
      setOpenConfirmationModal(true);
    }
  };

  const createCaseConfirmationProps = {
    open: dialogOpen,
    maxSize: "xs",
    confirmButtonLabel: isFamilyMember ? i18n.t("family.family_member.create") : i18n.t("case.create"),
    pending: caseFromFamilyMemberLoading,
    omitCloseAfterSuccess: true,
    dialogTitle: title,
    dialogText: isFamilyMember
      ? i18n.t("family.messages.confirm_create_case")
      : i18n.t("case.messages.confirm_create_case"),
    cancelHandler: () => {
      setDialog({ dialog: SUBFORM_CREATE_CASE_DIALOG, open: false });
    },
    successHandler: () => {
      if (isFamilyMember) {
        dispatch(createCaseFromFamilyMember({ familyId: params.id, familyMemberId: subformValues.unique_id }));
      }

      if (isFamilyDetail) {
        dispatch(createCaseFromFamilyDetail({ caseId: params.id, familyDetailId: subformValues.unique_id }));
      }
    }
  };

  const ComponentToRender = asDrawer ? SubformDrawer : ActionDialog;
  const propsForComponent = asDrawer
    ? {
        open,
        cancelHandler: handleClose,
        title: <ViolationTitle title={title} values={subformValues} fields={field.subform_section_id.fields} />
      }
    : {
        open,
        successHandler: e => boundSubmitForm(e),
        cancelHandler: handleClose,
        dialogTitle: title,
        title,
        omitCloseAfterSuccess: true,
        confirmButtonLabel: i18n.t(buttonDialogText),
        onClose: handleClose,
        dialogActions,
        disableActions: isFormShow
      };

  const violationTitle = i18n.t(`incident.violation.${isNewSubform ? "save" : "update"}_and_return`, {
    association: isViolationAssociation ? parentTitle || title : i18n.t("incident.violation.title")
  });
  const familyMemberTitle = i18n.t(`family.family_member.${isNewSubform ? "save" : "update"}_and_return`);
  const handleBackLabel = isViolation || isViolationAssociation ? violationTitle : familyMemberTitle;

  useLayoutEffect(() => {
    if (open) {
      setInitialValues(constructInitialValues([field.subform_section_id]));
    }
  }, [open]);

  return (
    <>
      <ComponentToRender {...propsForComponent}>
        <Formik
          initialValues={initialSubformValues}
          validationSchema={buildSchema()}
          validateOnBlur={false}
          validateOnChange={false}
          enableReinitialize
          onSubmit={values => onSubmit(values)}
          innerRef={childFormikRef}
        >
          {({ handleSubmit, submitForm, setErrors, setTouched, errors, values, setFieldValue }) => {
            bindSubmitForm(submitForm);

            return (
              <Form data-testid="subForm-dialog-form" autoComplete="off" onSubmit={handleSubmit}>
                <SubformErrors
                  initialErrors={initialSubformErrors}
                  errors={errors}
                  setErrors={setErrors}
                  setTouched={setTouched}
                />
                {asDrawer && (
                  <SubformDrawerActions
                    showActions={
                      isFamilySubform && !caseId ? (
                        <FamilySubformActions
                          recordType={recordType}
                          handleBack={handleClose}
                          handleBackLabel={familyHandleBackLabel}
                          pending={caseFromFamilyMemberLoading}
                          handleCreateLabel={familyCreateLabel}
                          handleCreate={() => {
                            setDialog({ dialog: SUBFORM_CREATE_CASE_DIALOG, open: true });
                          }}
                        />
                      ) : null
                    }
                    editActions={
                      <DefaultEditActions
                        handleSuccess={event => {
                          event.stopPropagation();
                          submitForm(event);
                        }}
                        handleBackLabel={handleBackLabel}
                        handleBack={event => submitForm(event)}
                        handleCancel={handleClose}
                      />
                    }
                    isShow={mode.isShow || isReadWriteForm === false}
                  />
                )}
                {isFamilySubform && mode.isShow && caseId && !caseFromFamilyMemberLoading && (
                  <SubformLink
                    href={`/${RECORD_TYPES_PLURAL.case}/${caseId}`}
                    label={i18n.t("family.family_member.case_id")}
                    text={caseIdDisplay}
                    disabled={!subformValues?.can_read_record}
                  />
                )}
                <components.SubformDialogFields
                  {...{
                    ...defaultSubformFieldProps,
                    field,
                    index,
                    values,
                    setFieldValue,
                    ...(field.name === SERVICES_SUBFORM_FIELD ? serviceSubformFieldProps : subformFieldProps)
                  }}
                />
              </Form>
            );
          }}
        </Formik>
      </ComponentToRender>
      {isFamilySubform && <ActionDialog {...createCaseConfirmationProps} />}
      <ActionDialog {...modalConfirmationProps} />
    </>
  );
}

Component.displayName = SUBFORM_DIALOG;

Component.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  asDrawer: PropTypes.bool.isRequired,
  components: PropTypes.objectOf({
    SubformItem: PropTypes.elementType.isRequired,
    SubformDialog: PropTypes.elementType.isRequired,
    SubformDialogFields: PropTypes.elementType.isRequired,
    SubformFieldSubform: PropTypes.elementType.isRequired,
    SubformField: PropTypes.elementType.isRequired
  }),
  dialogIsNew: PropTypes.bool.isRequired,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  formSection: PropTypes.object,
  i18n: PropTypes.object.isRequired,
  index: PropTypes.number,
  isFamilyDetail: PropTypes.bool,
  isFamilyMember: PropTypes.bool,
  isFormShow: PropTypes.bool,
  isReadWriteForm: PropTypes.bool,
  isViolation: PropTypes.bool.isRequired,
  isViolationAssociation: PropTypes.bool.isRequired,
  mode: PropTypes.object.isRequired,
  oldValue: PropTypes.object,
  open: PropTypes.bool.isRequired,
  orderedValues: PropTypes.array.isRequired,
  parentTitle: PropTypes.string,
  recordModuleID: PropTypes.string,
  recordType: PropTypes.string,
  setOpen: PropTypes.func.isRequired,
  SubformDialogFields: PropTypes.elementType.isRequired,
  subformSectionConfiguration: PropTypes.object,
  title: PropTypes.string.isRequired,
  violationOptions: PropTypes.array
};

export default Component;
