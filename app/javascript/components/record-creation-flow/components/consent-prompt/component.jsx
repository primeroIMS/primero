import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useForm } from "react-hook-form";
import Add from "@material-ui/icons/Add";

import { useMemoizedSelector } from "../../../../libs";
import { getRecordFormsByUniqueId } from "../../../record-form";
import { RECORD_TYPES, MODULES, LOOKUPS } from "../../../../config";
import FormSection from "../../../form/components/form-section";
import { whichFormMode } from "../../../form";
import { FORM_MODE_NEW } from "../../../form/constants";
import { getOptions } from "../../../form/selectors";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import { NAME, CONSENT, LIGITIMATE_FIELDS, FORM_ID } from "./constants";
import styles from "./styles.css";
import { consentPromptForm } from "./forms";

const Component = ({ i18n, recordType, searchValue }) => {
  const css = makeStyles(styles)();
  const formMode = whichFormMode(FORM_MODE_NEW);
  const methods = useForm({ defaultValues: {} });
  const { handleSubmit } = methods;

  const onSuccess = data => console.log(data);

  const consentForm = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      checkVisible: false,
      formName: CONSENT,
      primeroModule: MODULES.CP,
      recordType: RECORD_TYPES[recordType]
    })
  ).first();

  const consentAgreementFields = consentForm.fields.filter(field => LIGITIMATE_FIELDS.includes(field.name));
  const legitimateBasisLookup = useMemoizedSelector(state => getOptions(state, LOOKUPS.legitimate_basis, i18n));
  const legitimateBasisExplanationsLookup = useMemoizedSelector(state =>
    getOptions(state, LOOKUPS.legitimate_basis_explanations, i18n)
  );

  const renderCreateCaseText = searchValue && (
    <p className={css.createCaseText}>{i18n.t("case.messages.not_found_case", { search_value: searchValue })}</p>
  );

  const renderConsentPrompt = consentPromptForm(css, i18n, {
    consentAgreementFields,
    legitimateBasisLookup,
    legitimateBasisExplanationsLookup
  }).map(formSection => (
    <FormSection formSection={formSection} key={formSection.unique_id} formMode={formMode} formMethods={methods} />
  ));

  return (
    <div className={css.container}>
      <form id={FORM_ID} onSubmit={handleSubmit(onSuccess)}>
        {renderCreateCaseText}
        <p className={css.introductoryText}>{i18n.t("case.messages.introductory_sentence")}</p>
        {renderConsentPrompt}
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
  i18n: PropTypes.object.isRequired,
  recordType: PropTypes.string.isRequired,
  searchValue: PropTypes.string
};

export default Component;
