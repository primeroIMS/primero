import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useForm } from "react-hook-form";
import Add from "@material-ui/icons/Add";
import isEmpty from "lodash/isEmpty";

import { useMemoizedSelector } from "../../../../libs";
import { getRecordFormsByUniqueId } from "../../../record-form";
import { RECORD_TYPES, LOOKUPS } from "../../../../config";
import FormSection from "../../../form/components/form-section";
import { whichFormMode } from "../../../form";
import { FORM_MODE_NEW, TICK_FIELD, RADIO_FIELD } from "../../../form/constants";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { setDataProtectionInitialValues } from "../../../record-form/action-creators";
import useOptions from "../../../form/use-options";

import { NAME, CONSENT, FORM_ID, LEGITIMATE_BASIS } from "./constants";
import styles from "./styles.css";
import { consentPromptForm } from "./forms";

const Component = ({
  i18n,
  recordType,
  searchValue,
  primeroModule,
  dataProtectionFields,
  goToNewCase,
  openConsentPrompt
}) => {
  const css = makeStyles(styles)();
  const dispatch = useDispatch();
  const formMode = whichFormMode(FORM_MODE_NEW);
  const methods = useForm();
  const { handleSubmit } = methods;

  const onSuccess = data => {
    dispatch(setDataProtectionInitialValues(data));
    goToNewCase();
  };

  const legitimateBasisLookup = useOptions({ source: LOOKUPS.legitimate_basis });
  const legitimateBasisExplanationsLookup = useOptions({ source: LOOKUPS.legitimate_basis_explanations });

  const consentForm = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      checkVisible: false,
      formName: CONSENT,
      primeroModule,
      recordType: RECORD_TYPES[recordType],
      getFirst: true
    })
  );

  if (isEmpty(dataProtectionFields) || !openConsentPrompt) {
    return null;
  }

  const consentAgreementFields = consentForm.fields.filter(
    field =>
      (field.type === RADIO_FIELD ? field.option_strings_source === "lookup-yes-no" : field.type === TICK_FIELD) &&
      dataProtectionFields.filter(dataProtectionField => dataProtectionField !== LEGITIMATE_BASIS).includes(field.name)
  );

  const renderCreateCaseText = searchValue && (
    <p className={css.createCaseText}>{i18n.t("case.messages.not_found_case", { search_value: searchValue })}</p>
  );

  const renderLegitimateField = Boolean(
    dataProtectionFields.find(dataProtectionField => dataProtectionField === LEGITIMATE_BASIS)
  );

  const renderConsentPrompt = consentPromptForm(i18n, {
    renderConsentAgreementField: consentAgreementFields?.length > 0,
    consentAgreementFields,
    renderLegitimateField,
    legitimateBasisLookup,
    legitimateBasisExplanationsLookup
  }).map(formSection => (
    <FormSection formSection={formSection} key={formSection.unique_id} formMode={formMode} formMethods={methods} />
  ));

  return (
    <div className={css.container}>
      <form id={FORM_ID} onSubmit={handleSubmit(onSuccess)}>
        <div className={css.fieldsContent}>
          {renderCreateCaseText}
          <p className={css.introductoryText}>{i18n.t("case.messages.introductory_sentence")}</p>
          {renderConsentPrompt}
        </div>
        <div className={css.createButtonContainer}>
          <ActionButton
            icon={<Add />}
            text={i18n.t("buttons.create_case")}
            type={ACTION_BUTTON_TYPES.default}
            rest={{
              form: FORM_ID,
              type: "submit"
            }}
          />
        </div>
      </form>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  dataProtectionFields: PropTypes.array,
  goToNewCase: PropTypes.func,
  i18n: PropTypes.object.isRequired,
  openConsentPrompt: PropTypes.bool,
  primeroModule: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  searchValue: PropTypes.string
};

export default Component;
