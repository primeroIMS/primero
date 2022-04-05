import { memo, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { object } from "yup";
import { Formik } from "formik";
import isEmpty from "lodash/isEmpty";
import { batch, useDispatch } from "react-redux";

import { setSelectedForm } from "../action-creators";
import { clearCaseFromIncident } from "../../records/action-creators";
import { useI18n } from "../../i18n";
import { constructInitialValues, sortSubformValues } from "../utils";
import { useMemoizedSelector } from "../../../libs";
import { INCIDENT_FROM_CASE, RECORD_TYPES } from "../../../config";
import { getDataProtectionInitialValues } from "../selectors";
import { LEGITIMATE_BASIS } from "../../record-creation-flow/components/consent-prompt/constants";
import renderFormSections from "../components/render-form-sections";

import { RECORD_FORM_NAME } from "./constants";
import { fieldValidations } from "./validations";
import FormikForm from "./formik-form";

const RecordForm = ({
  attachmentForms,
  bindSubmitForm,
  forms,
  handleToggleNav,
  mobileDisplay,
  mode,
  onSubmit,
  record,
  recordType,
  selectedForm,
  incidentFromCase,
  externalForms,
  fetchFromCaseId,
  userPermittedFormsIds,
  externalComponents,
  primeroModule,
  setFormikValuesForNav
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = useState(mode.isNew ? constructInitialValues(forms.values()) : {});
  const [formTouched, setFormTouched] = useState({});
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const dataProtectionInitialValues = useMemoizedSelector(state => getDataProtectionInitialValues(state));

  const formikValues = useRef();
  const bindedSetValues = useRef(null);
  const bindedResetForm = useRef(null);

  const bindSetValues = setValues => {
    bindedSetValues.current = setValues;
  };

  const bindResetForm = resetForm => {
    bindedResetForm.current = resetForm;
  };

  const buildValidationSchema = formSections => {
    const schema = formSections.reduce((obj, item) => {
      return Object.assign(
        {},
        obj,
        ...item.fields.filter(field => !field.disabled).map(field => fieldValidations(field, i18n))
      );
    }, {});

    return object().shape(schema);
  };

  useEffect(() => {
    document.getElementsByClassName("record-form-container")[0].scrollTop = 0;
  }, [selectedForm]);

  useEffect(() => {
    const redirectToIncident = RECORD_TYPES.cases === recordType ? { redirectToIncident: false } : {};

    if (record) {
      const recordFormValues = { ...initialValues, ...record.toJS(), ...redirectToIncident };

      const subformValues = sortSubformValues(recordFormValues, forms.values());

      setInitialValues({ ...recordFormValues, ...subformValues });
    }
  }, [record]);

  useEffect(() => {
    if (incidentFromCase?.size && mode.isNew && RECORD_TYPES[recordType] === RECORD_TYPES.incidents) {
      const incidentCaseId = fetchFromCaseId ? { incident_case_id: fetchFromCaseId } : {};

      setInitialValues({ ...initialValues, ...incidentFromCase.toJS(), ...incidentCaseId });
    }
  }, [incidentFromCase, recordType]);

  useEffect(() => {
    if (bindedSetValues.current && initialValues && !isEmpty(formTouched) && !formIsSubmitting) {
      bindedSetValues.current({ ...initialValues, ...formikValues.current });
    }
  }, [bindedSetValues, initialValues, formTouched, formIsSubmitting]);

  useEffect(() => {
    if (!isEmpty(initialValues) && bindedResetForm.current) {
      bindedResetForm.current();
    }
  }, [JSON.stringify(initialValues)]);

  useEffect(() => {
    if (mode.isNew && dataProtectionInitialValues.size > 0) {
      const initialDataProtection = dataProtectionInitialValues.reduce((accumulator, values, key) => {
        if (key !== LEGITIMATE_BASIS) {
          const consentAgreementFields = values.reduce((acc, curr) => {
            return { ...acc, [curr]: true };
          }, {});

          return { ...accumulator, ...consentAgreementFields };
        }

        return { ...accumulator, [key]: values.reduce((acc, elem) => acc.concat(elem), []) };
      }, {});

      bindedSetValues.current({ ...initialValues, ...initialDataProtection });
    }
  }, [mode.isNew, dataProtectionInitialValues]);

  const handleConfirm = onConfirm => {
    onConfirm();
    if (incidentFromCase?.size) {
      batch(() => {
        dispatch(setSelectedForm(INCIDENT_FROM_CASE));
        dispatch(clearCaseFromIncident());
      });
    }
  };

  const setFormikValues = values => {
    formikValues.current = values;
  };

  if (!isEmpty(initialValues) && !isEmpty(forms)) {
    const validationSchema = buildValidationSchema(forms);
    const handleOnSubmit = values => {
      onSubmit(initialValues, values);
    };

    return (
      <>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
          enableReinitialize
          onSubmit={handleOnSubmit}
        >
          {props => {
            // eslint-disable-next-line react/prop-types
            const { submitForm, values } = props;

            bindSubmitForm(submitForm);
            setFormikValuesForNav(values);

            return (
              <FormikForm
                {...props}
                handleConfirm={handleConfirm}
                renderFormSections={renderFormSections(
                  externalForms,
                  selectedForm,
                  userPermittedFormsIds,
                  mobileDisplay,
                  handleToggleNav,
                  i18n,
                  recordType,
                  attachmentForms,
                  mode,
                  record,
                  primeroModule
                )}
                forms={forms}
                mode={mode}
                setFormikValues={setFormikValues}
                setFormIsSubmitting={setFormIsSubmitting}
                setFormTouched={setFormTouched}
                bindResetForm={bindResetForm}
                bindSetValues={bindSetValues}
                externalComponents={externalComponents}
              />
            );
          }}
        </Formik>
      </>
    );
  }

  return null;
};

RecordForm.displayName = RECORD_FORM_NAME;

RecordForm.whyDidYouRender = true;

RecordForm.propTypes = {
  attachmentForms: PropTypes.object,
  bindSubmitForm: PropTypes.func,
  externalComponents: PropTypes.func,
  externalForms: PropTypes.func,
  fetchFromCaseId: PropTypes.bool,
  forms: PropTypes.object.isRequired,
  handleToggleNav: PropTypes.func.isRequired,
  incidentFromCase: PropTypes.object,
  mobileDisplay: PropTypes.bool.isRequired,
  mode: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  primeroModule: PropTypes.string.isRequired,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setFormikValuesForNav: PropTypes.func,
  userPermittedFormsIds: PropTypes.object
};

export default memo(RecordForm);
