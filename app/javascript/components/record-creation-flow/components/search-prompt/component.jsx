import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/core/styles/makeStyles";

import FormSection from "../../../form/components/form-section";
import { whichFormMode } from "../../../form";
import { FORM_MODE_NEW } from "../../../form/constants";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";

import { NAME, FORM_ID } from "./constants";
import { searchPromptForm } from "./forms";
import styles from "./styles.css";

const Component = ({ setOpenConsentPrompt, i18n }) => {
  const css = makeStyles(styles)();
  const formMode = whichFormMode(FORM_MODE_NEW);
  const methods = useForm();

  console.log("Methods", methods, "form", searchPromptForm(i18n));
  const { handleSubmit } = methods;

  const onSuccess = data => {
    console.log("Data", data);
    setOpenConsentPrompt(true);
  };

  return (
    <div>
      <form id={FORM_ID} onSubmit={handleSubmit(onSuccess)}>
        {searchPromptForm(i18n).map(formSection => (
          <FormSection
            formSection={formSection}
            key={formSection.unique_id}
            formMode={formMode}
            formMethods={methods}
          />
        ))}
      </form>
      <div className={css.search}>
        <ActionButton
          icon={<SearchIcon />}
          text={i18n.t("navigation.search")}
          type={ACTION_BUTTON_TYPES.default}
          rest={{
            form: FORM_ID,
            type: "submit"
          }}
        />
      </div>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  i18n: PropTypes.object,
  setOpenConsentPrompt: PropTypes.func
};

export default Component;
