// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import PropTypes from "prop-types";

// eslint-disable-next-line import/no-named-as-default
import useFormFilters from "./use-form-filters";
import { getFilters } from "./utils";
import { NAME } from "./constants";

function Component({ formMode, primeroModule, recordId, recordType, selectedForm, showDrawer }) {
  const Filters = getFilters(selectedForm);

  const { clearFilters } = useFormFilters(selectedForm);

  useEffect(() => {
    return () => {
      clearFilters();
    };
  }, [selectedForm]);

  if (!Filters) {
    return null;
  }

  return (
    <Filters
      showDrawer={showDrawer}
      recordType={recordType}
      primeroModule={primeroModule}
      formMode={formMode}
      selectedForm={selectedForm}
      recordId={recordId}
    />
  );
}

Component.displayName = NAME;

Component.propTypes = {
  formMode: PropTypes.string,
  primeroModule: PropTypes.string,
  recordId: PropTypes.string,
  recordType: PropTypes.string,
  selectedForm: PropTypes.string,
  showDrawer: PropTypes.bool
};

export default Component;
