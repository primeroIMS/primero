// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";
import { fromJS } from "immutable";

import { useI18n } from "../../i18n";
import SearchBox from "../../index-filters/components/search-box/component";
import notPropagatedOnSubmit from "../../form/utils/not-propagated-on-submit";
import FormSectionField from "../../form/components/form-section-field";
import { FieldRecord, OPTION_TYPES, SELECT_FIELD } from "../../form";
import { compactBlank } from "../../record-form/utils";

function Component({ setComponent, setSearchParams }) {
  const i18n = useI18n();

  const methods = useForm({ shouldUnregister: false });

  const primeroModuleField = FieldRecord({
    name: "module_id",
    display_name: { [i18n.locale]: i18n.t("case.select_module") },
    type: SELECT_FIELD,
    option_strings_source: OPTION_TYPES.USER_MODULE
  });

  const handleSearch = async data => {
    await setSearchParams(compactBlank(data));
    setComponent(1);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={notPropagatedOnSubmit(methods.handleSubmit, handleSearch)} id="registry-search">
        <FormSectionField field={primeroModuleField} formMethods={methods} formMode={fromJS({ isEdit: true })} />
        <SearchBox showSearchButton={false} useFullWidth />
      </form>
    </FormProvider>
  );
}

Component.displayName = "RelationshipSearchForm";

Component.propTypes = {
  setComponent: PropTypes.func.isRequired,
  setDrawerTitle: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired
};

export default Component;
