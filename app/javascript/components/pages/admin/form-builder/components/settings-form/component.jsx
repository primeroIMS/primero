import PropTypes from "prop-types";

import FormSection from "../../../../../form/components/form-section";
import { useI18n } from "../../../../../i18n";
import { settingsForm } from "../../forms";

function Component({ formMethods, formMode, onManageTranslation, onEnglishTextChange, limitedProductionSite }) {
  const i18n = useI18n();

  return settingsForm({ formMode, onManageTranslation, onEnglishTextChange, i18n, limitedProductionSite }).map(
    formSection => (
      <FormSection
        formSection={formSection}
        key={formSection.unique_id}
        formMethods={formMethods}
        formMode={formMode}
      />
    )
  );
}

Component.displayName = "SettingsForm";

Component.propTypes = {
  formMethods: PropTypes.object,
  formMode: PropTypes.object,
  limitedProductionSite: PropTypes.bool,
  onEnglishTextChange: PropTypes.func,
  onManageTranslation: PropTypes.func
};

export default Component;
