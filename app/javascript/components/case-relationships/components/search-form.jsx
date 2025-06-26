// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useForm, FormProvider } from "react-hook-form";
import PropTypes from "prop-types";

import SearchBox from "../../index-filters/components/search-box/component";
import notPropagatedOnSubmit from "../../form/utils/not-propagated-on-submit";
import { compactBlank } from "../../record-form/utils";

function Component({ searchCaseType, setComponent, setSearchParams }) {
  const methods = useForm({ shouldUnregister: false });

  const handleSearch = async data => {
    await setSearchParams({ ...compactBlank(data), case_type: searchCaseType });
    setComponent(1);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={notPropagatedOnSubmit(methods.handleSubmit, handleSearch)} id="registry-search">
        <SearchBox showSearchButton={false} useFullWidth />
      </form>
    </FormProvider>
  );
}

Component.displayName = "RelationshipSearchForm";

Component.propTypes = {
  searchCaseType: PropTypes.string.isRequired,
  setComponent: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired
};

export default Component;
