import PropTypes from "prop-types";

import { FieldRecord, TEXT_FIELD } from "../../../../../form";
import FormSectionField from "../../../../../form/components/form-section-field";
import { useI18n } from "../../../../../i18n";

function Component({ defaultLocale, formMethods, formMode, localesKeys, selectedOption }) {
  const i18n = useI18n();

  return localesKeys.map(localeID => {
    const show = defaultLocale === localeID || selectedOption === localeID;

    return (
      <FormSectionField
        field={FieldRecord({
          display_name:
            defaultLocale === localeID ? i18n.t("lookup.english_label") : i18n.t("lookup.translation_label"),
          name: `name.${localeID}`,
          type: TEXT_FIELD,
          required: true,
          showIf: () => show,
          forceShowIf: true
        })}
        key={`name.${localeID}`}
        formMode={formMode}
        formMethods={formMethods}
      />
    );
  });
}

Component.displayName = "LookupLocalizedName";

Component.propTypes = {
  defaultLocale: PropTypes.string,
  formMethods: PropTypes.object,
  formMode: PropTypes.object,
  localesKeys: PropTypes.array,
  selectedOption: PropTypes.string
};

export default Component;
