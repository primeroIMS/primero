import { FormProvider, useForm } from "react-hook-form";
import PropTypes from "prop-types";

import SearchBox from "../../../../../../index-filters/components/search-box";
import { buildSearchParams } from "../../../../../../case-linked-record/utils";
import { FORM_ID } from "../../../../../../case-linked-record/constants";
import { notPropagatedOnSubmit } from "../../../../../../form";

function Component({ recordType, setSearchParams, setComponent, phoneticFieldNames }) {
  const methods = useForm({
    shouldUnregister: false
  });

  const handleSubmit = async data => {
    // eslint-disable-next-line camelcase
    const { search_by, ...params } = data;

    const searchParams = buildSearchParams(params, phoneticFieldNames);

    await setSearchParams({ ...searchParams, record_state: true });
    setComponent(1);
  };

  return (
    <FormProvider {...methods}>
      <form id={FORM_ID} onSubmit={notPropagatedOnSubmit(methods.handleSubmit, handleSubmit)}>
        <SearchBox recordType={recordType} showSearchButton={false} />
      </form>
    </FormProvider>
  );
}

Component.displayName = "RegistrySearch";

Component.propTypes = {
  metadata: PropTypes.object,
  phoneticFieldNames: PropTypes.array.isRequired,
  recordType: PropTypes.string.isRequired,
  setComponent: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  setSelectedRecords: PropTypes.func
};

export default Component;
