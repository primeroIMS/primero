import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useForm } from "react-hook-form";

import { useMemoizedSelector } from "../../../../libs";
import { getRecordFormsByUniqueId } from "../../../record-form";
import { RECORD_TYPES, MODULES } from "../../../../config";
import FormSection from "../../../form/components/form-section";
import { whichFormMode } from "../../../form";
import { FORM_MODE_NEW } from "../../../form/constants";

import { NAME, CONSENT, LIGITIMATE_FIELDS } from "./constants";
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

  const legitimateFields = consentForm.fields.filter(field => LIGITIMATE_FIELDS.includes(field.name));

  console.log("legitimateFields", legitimateFields);

  const renderCreateCaseText = searchValue && (
    <p className={css.createCaseText}>{i18n.t("case.messages.not_found_case", { search_value: searchValue })}</p>
  );

  return (
    <div className={css.container}>
      <form id="test" onSubmit={handleSubmit(onSuccess)}>
        {renderCreateCaseText}
        <p className={css.introductoryText}>{i18n.t("case.messages.introductory_sentence")}</p>
        {consentPromptForm(i18n, { legitimateFields }).map(formSection => (
          <FormSection
            formSection={formSection}
            key={formSection.unique_id}
            formMode={formMode}
            formMethods={methods}
          />
        ))}
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
