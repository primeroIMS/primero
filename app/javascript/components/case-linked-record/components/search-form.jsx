// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";

import { useMemoizedSelector } from "../../../libs";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../action-button";
import { getRegistryTypes } from "../../application/selectors";
import Form, { FieldRecord, FormSectionRecord, SELECT_FIELD } from "../../form";
import { useI18n } from "../../i18n";
import css from "../../record-form/form/subforms/styles.css";
import { FORM_ID, REGISTRY_LOCATION_CURRENT, SEARCH_BY } from "../constants";
import { buildSearchParams, buildValidation } from "../utils";

function Component({
  fields,
  formId,
  handleCancel,
  locale,
  noForm = false,
  permissions,
  phoneticFieldNames = [],
  redirectIfNotAllowed,
  setComponent,
  setDrawerTitle,
  setSearchParams,
  validatedFieldNames
}) {
  const i18n = useI18n();

  const registryType = useMemoizedSelector(state => getRegistryTypes(state, "farmer"));

  redirectIfNotAllowed(permissions.writeRegistryRecord);

  setDrawerTitle("search_for", {
    record_type: noForm ? i18n.t("navigation.registry_records") : registryType.getIn(["display_text", i18n.locale], "")
  });

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

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <ActionButton
          type={ACTION_BUTTON_TYPES.default}
          text="case.back_to_case"
          rest={{ onClick: handleCancel }}
          icon={<ArrowBackIosIcon />}
        />
        <ActionButton
          type={ACTION_BUTTON_TYPES.default}
          text="navigation.search"
          rest={{ form: FORM_ID, type: "submit" }}
          icon={<SearchIcon />}
        />
      </div>
      <Form formID={FORM_ID} formSections={formFields} onSubmit={handleSearch} validations={validationSchema} />
    </>
  );
}

Component.displayName = "SearchForm";

Component.propTypes = {
  fields: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  handleCancel: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  noForm: PropTypes.bool,
  permissions: PropTypes.object.isRequired,
  phoneticFieldNames: PropTypes.array.isRequired,
  redirectIfNotAllowed: PropTypes.func.isRequired,
  setComponent: PropTypes.func.isRequired,
  setDrawerTitle: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  validatedFieldNames: PropTypes.array.isRequired
};

export default Component;
