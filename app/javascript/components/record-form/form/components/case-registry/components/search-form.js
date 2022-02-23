import PropTypes from "prop-types";

import { useMemoizedSelector } from "../../../../../../libs";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../action-button";
import { getRegistryTypes } from "../../../../../application/selectors";
import Form, { FieldRecord, FormSectionRecord, SELECT_FIELD } from "../../../../../form";
import { useI18n } from "../../../../../i18n";
import css from "../../../subforms/styles.css";
import { FORM_ID, REGISTRY_LOCATION_CURRENT, SEARCH_BY, NAME, REGISTRY_NO } from "../constants";
import { buildValidation } from "../utils";

const SearchForm = ({
  redirectIfNotAllowed,
  setComponent,
  setSearchParams,
  handleCancel,
  fields,
  setDrawerTitle,
  locale,
  permissions,
  noForm = false
}) => {
  const i18n = useI18n();

  const registryType = useMemoizedSelector(state => getRegistryTypes(state, "farmer"));

  redirectIfNotAllowed(permissions.writeRegistryRecord);

  setDrawerTitle("search_for", {
    record_type: noForm ? i18n.t("navigation.registry_records") : registryType.getIn(["display_text", i18n.locale], "")
  });

  const handleSearch = async data => {
    // eslint-disable-next-line camelcase
    const { search_by, ...searchParams } = data;

    await setSearchParams(searchParams);
    setComponent(1);
  };

  const searchByField = FieldRecord({
    display_name: i18n.t("case.search_by"),
    name: SEARCH_BY,
    type: SELECT_FIELD,
    option_strings_text: fields
      .filter(field => field.name !== REGISTRY_LOCATION_CURRENT)
      .map(field => ({ id: field.name, display_text: field.display_name[locale] }))
  });

  const formFields = [
    FormSectionRecord({
      unique_id: FORM_ID,
      fields: [searchByField, ...fields.valueSeq()].map(field => {
        if ([NAME, REGISTRY_NO].includes(field.name)) {
          return field.merge({
            watchedInputs: SEARCH_BY,
            showIf: searchBy => {
              if (field.name === NAME || field.name === REGISTRY_NO) {
                return searchBy === field.name;
              }

              return false;
            }
          });
        }

        return field;
      })
    })
  ];

  const validationSchema = buildValidation(formFields[0].fields);

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <ActionButton type={ACTION_BUTTON_TYPES.default} text="case.back_to_case" rest={{ onClick: handleCancel }} />
        <ActionButton
          type={ACTION_BUTTON_TYPES.default}
          text="navigation.search"
          rest={{ form: FORM_ID, type: "submit" }}
        />
      </div>
      <Form formID={FORM_ID} formSections={formFields} onSubmit={handleSearch} validations={validationSchema} />
    </>
  );
};

SearchForm.displayName = "SearchForm";

SearchForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  noForm: PropTypes.bool,
  permissions: PropTypes.object.isRequired,
  redirectIfNotAllowed: PropTypes.func.isRequired,
  setComponent: PropTypes.func.isRequired,
  setDrawerTitle: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired
};

export default SearchForm;
