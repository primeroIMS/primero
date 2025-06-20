// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";

import Form, { FieldRecord, FormSectionRecord, SELECT_FIELD } from "../../form";
import { useI18n } from "../../i18n";
import { FORM_ID, REGISTRY_LOCATION_CURRENT, SEARCH_BY } from "../constants";
import { buildSearchParams, buildValidation } from "../utils";

function Component({
  fields,
  formId,
  locale,
  permissions,
  phoneticFieldNames = [],
  redirectIfNotAllowed,
  setComponent,
  setSearchParams,
  validatedFieldNames
}) {
  const i18n = useI18n();

  useEffect(() => {
    redirectIfNotAllowed(permissions.writeRegistryRecord);
  }, []);

  const handleSearch = async data => {
    // eslint-disable-next-line camelcase
    const { search_by, ...params } = data;

    const searchParams = buildSearchParams(params, phoneticFieldNames);

    await setSearchParams({ ...searchParams, record_state: true });
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
      unique_id: formId,
      fields: [searchByField, ...fields.valueSeq()].map(field => {
        if (validatedFieldNames.includes(field.name)) {
          return field.merge({
            watchedInputs: SEARCH_BY,
            showIf: searchBy => {
              if (validatedFieldNames.includes(field.name)) {
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

  const searchByRequiredMessage = i18n.t("fields.required_field", { field: i18n.t("case.search_by") });

  const validationSchema = buildValidation(formFields[0].fields, searchByRequiredMessage);

  return <Form formID={FORM_ID} formSections={formFields} onSubmit={handleSearch} validations={validationSchema} />;
}

Component.displayName = "SearchForm";

Component.propTypes = {
  fields: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  permissions: PropTypes.object.isRequired,
  phoneticFieldNames: PropTypes.array.isRequired,
  redirectIfNotAllowed: PropTypes.func.isRequired,
  setComponent: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  validatedFieldNames: PropTypes.array.isRequired
};

export default Component;
