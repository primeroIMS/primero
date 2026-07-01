import { FormProvider, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import isNil from "lodash/isNil";
import omitBy from "lodash/omitBy";

import SearchBox from "../../../../../../index-filters/components/search-box";
import { buildSearchParams } from "../../../../../../case-linked-record/utils";
import { FORM_ID } from "../../../../../../case-linked-record/constants";
import { FormSection, FormSectionRecord, notPropagatedOnSubmit } from "../../../../../../form";

function Component({ fields, mode, recordType, setSearchParams, setComponent, phoneticFieldNames }) {
  const methods = useForm({
    shouldUnregister: false
  });

  const handleSubmit = async data => {
    // eslint-disable-next-line camelcase
    const { search_by, ...params } = data;

    const searchParams = buildSearchParams(params, phoneticFieldNames);

    await setSearchParams(omitBy({ ...searchParams, record_state: true }, isNil));
    setComponent(1);
  };

  const formSections = [
    FormSectionRecord({
      unique_id: FORM_ID,
      fields
    })
  ];

  const renderFormSections = () =>
    formSections.map(formSection => (
      <FormSection
        showTitle={false}
        formSection={formSection}
        key={formSection.unique_id}
        errors={methods.errors}
        formMethods={methods}
        formMode={fromJS(mode)}
      />
    ));

  return (
    <FormProvider {...methods}>
      <form id={FORM_ID} onSubmit={notPropagatedOnSubmit(methods.handleSubmit, handleSubmit)}>
        <SearchBox recordType={recordType} showSearchButton={false} />
        {renderFormSections(formSections)}
      </form>
    </FormProvider>
  );
}

Component.displayName = "RegistrySearch";

Component.propTypes = {
  fields: PropTypes.array.isRequired,
  metadata: PropTypes.object,
  mode: PropTypes.object.isRequired,
  phoneticFieldNames: PropTypes.array.isRequired,
  recordType: PropTypes.string.isRequired,
  setComponent: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  setSelectedRecords: PropTypes.func
};

export default Component;
