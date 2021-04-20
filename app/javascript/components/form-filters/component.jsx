import { useEffect } from "react";
import PropTypes from "prop-types";

// eslint-disable-next-line import/no-named-as-default
import useFormFilters from "./use-form-filters";
import { getFilters } from "./utils";
import { NAME } from "./constants";

const Component = ({ formMode, primeroModule, recordType, selectedForm, showDrawer }) => {
  const Filters = getFilters(selectedForm);

  const { clearFilters } = useFormFilters(selectedForm);

  useEffect(() => {
    clearFilters();
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
    />
  );
};

Component.displayName = NAME;

Component.propTypes = {
  formMode: PropTypes.string,
  primeroModule: PropTypes.string,
  recordType: PropTypes.string,
  selectedForm: PropTypes.string,
  showDrawer: PropTypes.bool
};

export default Component;
