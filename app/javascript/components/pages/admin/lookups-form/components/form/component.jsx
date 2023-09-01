/* eslint-disable react/display-name, react/no-multi-comp */

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useForm, useWatch } from "react-hook-form";
import { fromJS } from "immutable";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import pull from "lodash/pull";

import {
  buildValues,
  getInitialValues,
  getInitialNames,
  reorderValues,
  validations,
  getDisabledInfo
} from "../../utils";
import { FieldRecord, SELECT_FIELD } from "../../../../../form";
import FormSectionField from "../../../../../form/components/form-section-field";
import { useI18n } from "../../../../../i18n";
import { dataToJS } from "../../../../../../libs";
import { LOOKUP_NAME, LOOKUP_VALUES } from "../../constants";
import LookupLocalizedName from "../lookup-localized-name";
import LookupOptions from "../lookup-options";
import { saveLookup } from "../../action-creators";
import { LOCALE_KEYS, SAVE_METHODS } from "../../../../../../config";

import { NAME, FORM_ID } from "./constants";

const Component = ({ formMode, isLockedLookup, lookup }) => {
  const { id } = useParams();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const locales = i18n.applicationLocales;
  const localesKeys = [
    LOCALE_KEYS.en,
    ...pull(
      locales.map(locale => locale.id),
      LOCALE_KEYS.en
    )
  ];
  const firstLocaleOption = find(locales, ["id", LOCALE_KEYS.en]);
  const defaultLocale = LOCALE_KEYS.en;
  const validationsSchema = validations(i18n);
  const currentLookupValues = lookup.get(LOOKUP_VALUES, fromJS([]));

  const formMethods = useForm({
    ...(validationsSchema && { resolver: yupResolver(validationsSchema) }),
    shouldUnregister: false
  });
  const { control, reset, handleSubmit } = formMethods;

  const watchedOption = useWatch({
    control,
    name: "options"
  });

  const selectedOption = watchedOption?.id || watchedOption;
  const keys = [...currentLookupValues.map(t => t.get("id"))];
  const [items, setItems] = useState(keys);

  const values = getInitialValues(localesKeys, dataToJS(currentLookupValues));

  const defaultValues = {
    name: getInitialNames(localesKeys, dataToJS(lookup.get(LOOKUP_NAME))),
    options: firstLocaleOption,
    disabled: getDisabledInfo(currentLookupValues),
    values
  };

  const onSubmit = data => {
    const { name, values: lookupValues, disabled } = data;

    const body = {
      data: {
        name,
        values: buildValues(lookupValues, i18n.locale, disabled, items)
      }
    };

    dispatch(
      saveLookup({
        id,
        saveMethod: formMode.get("isEdit") ? SAVE_METHODS.update : SAVE_METHODS.new,
        body,
        message: i18n.t(`lookup.messages.${formMode.get("isEdit") ? "updated" : "created"}`)
      })
    );
  };

  useEffect(() => {
    if (keys.length) {
      setItems(keys);
    }
    reset(defaultValues);
  }, [defaultValues.name[defaultLocale]]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={FORM_ID} data-testid="switch-input">
      <FormSectionField
        field={FieldRecord({
          display_name: i18n.t("lookup.language_label"),
          name: "options",
          type: SELECT_FIELD,
          option_strings_text: locales,
          editable: !(locales?.length === 1),
          disabled: locales?.length === 1
        })}
        formMode={formMode}
        formMethods={formMethods}
      />
      {!isEmpty(localesKeys) && (
        <LookupLocalizedName
          defaultLocale={defaultLocale}
          formMethods={formMethods}
          formMode={formMode}
          localesKeys={localesKeys}
          selectedOption={selectedOption}
        />
      )}
      <LookupOptions
        defaultLocale={defaultLocale}
        formMethods={formMethods}
        formMode={formMode}
        items={items}
        localesKeys={localesKeys}
        reorderValues={reorderValues}
        selectedOption={selectedOption}
        setItems={setItems}
        values={values}
        isLockedLookup={isLockedLookup}
      />
    </form>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  formMode: PropTypes.object,
  isLockedLookup: PropTypes.bool,
  lookup: PropTypes.object
};

export default Component;
